import { 
  GraphNode, 
  GraphEdge, 
  CampusLocation, 
  WalkableRouteResponse, 
  TurnByTurnInstruction, 
  StepDirectionType,
  RouteNavigationState,
  CanvasCoordinates
} from '../models/campus';
import { CAMPUS_GRAPH_NODES, CAMPUS_GRAPH_EDGES, CAMPUS_LOCATIONS } from '../data/campusDatabase';
import { 
  haversineDistanceMeters, 
  calculateBearing, 
  calculateTurnAngle, 
  gpsToCanvas, 
  canvasToGps, 
  distanceToSegmentMeters,
  GeoPoint 
} from '../utils/geoUtils';

interface AdjacencyEdge {
  target: string;
  distance: number;
  isStairs?: boolean;
  isElevator?: boolean;
}

export class RoutingService {
  private nodes: Map<string, GraphNode> = new Map();
  private edges: GraphEdge[] = [];
  private adjacencyList: Map<string, AdjacencyEdge[]> = new Map();
  private locations: Map<string, CampusLocation> = new Map();

  constructor(
    nodes: GraphNode[] = CAMPUS_GRAPH_NODES,
    edges: GraphEdge[] = CAMPUS_GRAPH_EDGES,
    locations: CampusLocation[] = CAMPUS_LOCATIONS
  ) {
    this.edges = [...edges];

    nodes.forEach(node => {
      this.nodes.set(node.id, node);
      this.adjacencyList.set(node.id, []);
    });

    edges.forEach(edge => {
      if (edge.walkingAllowed !== false) {
        // Forward edge
        this.adjacencyList.get(edge.from)?.push({
          target: edge.to,
          distance: edge.distance,
          isStairs: edge.isStairs,
          isElevator: edge.isElevator,
        });
        // Bidirectional walkable edge
        this.adjacencyList.get(edge.to)?.push({
          target: edge.from,
          distance: edge.distance,
          isStairs: edge.isStairs,
          isElevator: edge.isElevator,
        });
      }
    });

    locations.forEach(loc => {
      this.locations.set(loc.id, loc);
    });
  }

  public getAllLocations(): CampusLocation[] {
    return Array.from(this.locations.values());
  }

  public getLocationById(id: string): CampusLocation | undefined {
    return this.locations.get(id);
  }

  public getNodeById(id: string): GraphNode | undefined {
    return this.nodes.get(id);
  }

  public getAllNodes(): GraphNode[] {
    return Array.from(this.nodes.values());
  }

  public getAllEdges(): GraphEdge[] {
    return [...this.edges];
  }

  /**
   * Find nearest campus graph node to a given GPS coordinate
   */
  public findNearestNodeToGeo(geo: GeoPoint): { node: GraphNode; distanceMeters: number } {
    let nearestNode = CAMPUS_GRAPH_NODES[0];
    let minDistance = Infinity;

    this.nodes.forEach(node => {
      const dist = haversineDistanceMeters(geo, { lat: node.lat, lng: node.lng });
      if (dist < minDistance) {
        minDistance = dist;
        nearestNode = node;
      }
    });

    return { node: nearestNode, distanceMeters: Math.round(minDistance) };
  }

  /**
   * Find nearest campus graph node to a given canvas (x, y) coordinate
   */
  public findNearestNodeToCanvas(coord: CanvasCoordinates): { node: GraphNode; distancePixels: number } {
    let nearestNode = CAMPUS_GRAPH_NODES[0];
    let minDistance = Infinity;

    this.nodes.forEach(node => {
      const dist = Math.hypot(node.x - coord.x, node.y - coord.y);
      if (dist < minDistance) {
        minDistance = dist;
        nearestNode = node;
      }
    });

    return { node: nearestNode, distancePixels: Math.round(minDistance) };
  }

  /**
   * Shortest Path calculation using Dijkstra's Algorithm with A* Heuristic
   */
  public calculateShortestPath(
    sourceNodeId: string,
    targetNodeId: string,
    requireAccessible: boolean = false
  ): { path: GraphNode[]; totalDistance: number } | null {
    if (!this.nodes.has(sourceNodeId) || !this.nodes.has(targetNodeId)) {
      return null;
    }

    if (sourceNodeId === targetNodeId) {
      const singleNode = this.nodes.get(sourceNodeId)!;
      return { path: [singleNode], totalDistance: 0 };
    }

    const targetNode = this.nodes.get(targetNodeId)!;

    // Distances from start
    const gScore: Map<string, number> = new Map();
    // fScore = gScore + heuristic (straight-line distance to goal)
    const fScore: Map<string, number> = new Map();
    const previous: Map<string, string | null> = new Map();
    const openSet: Set<string> = new Set([sourceNodeId]);

    this.nodes.forEach((node, id) => {
      gScore.set(id, Infinity);
      fScore.set(id, Infinity);
      previous.set(id, null);
    });

    gScore.set(sourceNodeId, 0);
    const h0 = haversineDistanceMeters(
      { lat: this.nodes.get(sourceNodeId)!.lat, lng: this.nodes.get(sourceNodeId)!.lng },
      { lat: targetNode.lat, lng: targetNode.lng }
    );
    fScore.set(sourceNodeId, h0);

    while (openSet.size > 0) {
      // Pick node in openSet with lowest fScore
      let currentId: string | null = null;
      let lowestF = Infinity;

      openSet.forEach(nodeId => {
        const score = fScore.get(nodeId) ?? Infinity;
        if (score < lowestF) {
          lowestF = score;
          currentId = nodeId;
        }
      });

      if (!currentId || lowestF === Infinity) break;

      if (currentId === targetNodeId) {
        // Reconstruct path
        const pathNodes: GraphNode[] = [];
        let curr: string | null = targetNodeId;
        while (curr) {
          const n = this.nodes.get(curr);
          if (n) pathNodes.unshift(n);
          curr = previous.get(curr) ?? null;
        }

        const totalDist = gScore.get(targetNodeId) || 0;
        return { path: pathNodes, totalDistance: Math.round(totalDist) };
      }

      openSet.delete(currentId);

      const currentNode = this.nodes.get(currentId)!;
      const neighbors = this.adjacencyList.get(currentId) || [];

      for (const edge of neighbors) {
        if (requireAccessible && edge.isStairs && !edge.isElevator) {
          continue; // Skip stairs in accessible mode
        }

        const tentativeG = (gScore.get(currentId) ?? Infinity) + edge.distance;
        if (tentativeG < (gScore.get(edge.target) ?? Infinity)) {
          previous.set(edge.target, currentId);
          gScore.set(edge.target, tentativeG);

          const neighborNode = this.nodes.get(edge.target)!;
          const h = haversineDistanceMeters(
            { lat: neighborNode.lat, lng: neighborNode.lng },
            { lat: targetNode.lat, lng: targetNode.lng }
          );
          fScore.set(edge.target, tentativeG + h);

          openSet.add(edge.target);
        }
      }
    }

    return null; // No walkable path
  }

  /**
   * Primary route generation from startLocation to destination
   */
  public buildRoute(params: {
    startLocation?: { latitude?: number; longitude?: number; nodeId?: string; id?: string };
    destination: { id?: string; name?: string; nodeId?: string };
    accessibleMode?: boolean;
  }): WalkableRouteResponse | null {
    const { startLocation, destination, accessibleMode = false } = params;

    // Resolve destination
    let destLoc: CampusLocation | undefined;
    if (destination.id) {
      destLoc = this.locations.get(destination.id);
    }
    if (!destLoc && destination.name) {
      const q = destination.name.toLowerCase();
      destLoc = Array.from(this.locations.values()).find(
        l => l.name.toLowerCase() === q || l.name.toLowerCase().includes(q)
      );
    }
    if (!destLoc) return null;

    // Resolve source node
    let sourceNode: GraphNode | undefined;
    let sourceName = 'Current Location';

    if (startLocation?.latitude !== undefined && startLocation?.longitude !== undefined) {
      const nearest = this.findNearestNodeToGeo({
        lat: Number(startLocation.latitude),
        lng: Number(startLocation.longitude),
      });
      sourceNode = nearest.node;
      sourceName = `Near ${nearest.node.name}`;
    } else if (startLocation?.nodeId) {
      sourceNode = this.nodes.get(startLocation.nodeId);
      if (sourceNode) sourceName = sourceNode.name;
    } else if (startLocation?.id) {
      const loc = this.locations.get(startLocation.id);
      if (loc) {
        sourceNode = this.nodes.get(loc.nodeId);
        sourceName = loc.name;
      }
    }

    // Default source is Main Gate
    if (!sourceNode) {
      sourceNode = this.nodes.get('node_main_gate')!;
      sourceName = 'Main Gate Entrance';
    }

    const targetNodeId = destLoc.nodeId;
    const shortest = this.calculateShortestPath(sourceNode.id, targetNodeId, accessibleMode);
    if (!shortest) return null;

    const pathNodes = shortest.path;
    const walkingSpeedMps = 1.35; // ~4.86 km/h campus walking pace
    const estimatedSeconds = Math.round(shortest.totalDistance / walkingSpeedMps);
    const estimatedMinutes = Math.max(1, Math.round(estimatedSeconds / 60));

    // Generate Turn-by-Turn walking instructions
    const instructions = this.generateTurnByTurnInstructions(pathNodes, destLoc, accessibleMode);

    const routeId = `route_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    return {
      routeId,
      source: {
        nodeId: sourceNode.id,
        name: sourceName,
        coordinates: { x: sourceNode.x, y: sourceNode.y },
        geoCoordinates: { latitude: sourceNode.lat, longitude: sourceNode.lng },
      },
      destination: {
        id: destLoc.id,
        nodeId: destLoc.nodeId,
        name: destLoc.name,
        building: destLoc.building,
        floor: destLoc.floor,
        room: destLoc.room,
        coordinates: { x: destLoc.coordinates.x, y: destLoc.coordinates.y },
        geoCoordinates: { latitude: destLoc.coordinates.latitude, longitude: destLoc.coordinates.longitude },
      },
      totalDistance: shortest.totalDistance,
      estimatedMinutes,
      estimatedSeconds,
      pathNodes,
      instructions,
      isAccessible: accessibleMode,
      calculatedAt: new Date().toISOString(),
    };
  }

  /**
   * Generates natural language turn-by-turn walking instructions with distances & previews
   */
  private generateTurnByTurnInstructions(
    pathNodes: GraphNode[],
    destLoc: CampusLocation,
    isAccessible: boolean
  ): TurnByTurnInstruction[] {
    const instructions: TurnByTurnInstruction[] = [];
    const walkingSpeedMps = 1.35;

    if (pathNodes.length === 1) {
      instructions.push({
        stepNumber: 1,
        type: 'destination',
        instruction: `You have arrived at ${destLoc.name}`,
        subInstruction: `${destLoc.building}, ${destLoc.room ? destLoc.room : 'Campus'}`,
        distance: 0,
        durationSeconds: 0,
        nodeId: pathNodes[0].id,
        coordinates: { x: pathNodes[0].x, y: pathNodes[0].y },
        geoCoordinates: { latitude: pathNodes[0].lat, longitude: pathNodes[0].lng },
        floor: pathNodes[0].floor,
      });
      return instructions;
    }

    // Step 1: Initial departure
    const distToFirst = Math.round(haversineDistanceMeters(
      { lat: pathNodes[0].lat, lng: pathNodes[0].lng },
      { lat: pathNodes[1].lat, lng: pathNodes[1].lng }
    )) || 25;

    instructions.push({
      stepNumber: 1,
      type: 'start',
      instruction: `Head straight towards ${pathNodes[1].name} for ${distToFirst} m`,
      subInstruction: `Begin walking from ${pathNodes[0].name}`,
      distance: distToFirst,
      durationSeconds: Math.round(distToFirst / walkingSpeedMps),
      nodeId: pathNodes[0].id,
      coordinates: { x: pathNodes[0].x, y: pathNodes[0].y },
      geoCoordinates: { latitude: pathNodes[0].lat, longitude: pathNodes[0].lng },
      floor: pathNodes[0].floor,
      nextPreview: pathNodes.length > 2 ? `Turn towards ${pathNodes[2].name}` : `Arrive at ${destLoc.name}`,
    });

    // Intermediate steps
    for (let i = 1; i < pathNodes.length - 1; i++) {
      const prev = pathNodes[i - 1];
      const curr = pathNodes[i];
      const next = pathNodes[i + 1];

      const segmentDist = Math.round(haversineDistanceMeters(
        { lat: curr.lat, lng: curr.lng },
        { lat: next.lat, lng: next.lng }
      )) || 30;

      let type: StepDirectionType = 'straight';
      let instructionText = `Continue straight for ${segmentDist} m`;
      let subText = `Pass ${curr.name}`;

      // Floor transition check
      if (curr.floor !== next.floor) {
        type = isAccessible ? 'elevator' : 'stairs';
        const targetFloorName = next.floor === 0 ? 'Ground Floor' : `${next.floor}${this.getOrdinal(next.floor)} Floor`;
        instructionText = isAccessible
          ? `Take the elevator to ${targetFloorName}`
          : `Take the staircase up to ${targetFloorName}`;
        subText = `Continue towards ${next.name}`;
      } else if (curr.buildingId && !prev.buildingId) {
        type = 'enter-building';
        instructionText = `Enter ${curr.buildingId.toUpperCase() === 'ACAD_A' ? 'Academic Block A' : curr.buildingId.toUpperCase() === 'ACAD_B' ? 'Academic Block B' : 'building foyer'}`;
        subText = `Walk straight for ${segmentDist} m towards ${next.name}`;
      } else {
        // Calculate bearing change
        const b1 = calculateBearing({ lat: prev.lat, lng: prev.lng }, { lat: curr.lat, lng: curr.lng });
        const b2 = calculateBearing({ lat: curr.lat, lng: curr.lng }, { lat: next.lat, lng: next.lng });
        const turnAngle = calculateTurnAngle(b1, b2);

        if (turnAngle > 50) {
          type = 'turn-right';
          instructionText = `Turn right and walk ${segmentDist} m`;
          subText = `Head towards ${next.name}`;
        } else if (turnAngle < -50) {
          type = 'turn-left';
          instructionText = `Turn left and walk ${segmentDist} m`;
          subText = `Head towards ${next.name}`;
        } else if (turnAngle > 20) {
          type = 'slight-right';
          instructionText = `Bear slightly right for ${segmentDist} m`;
          subText = `Follow the pathway to ${next.name}`;
        } else if (turnAngle < -20) {
          type = 'slight-left';
          instructionText = `Bear slightly left for ${segmentDist} m`;
          subText = `Follow the pathway to ${next.name}`;
        } else if (Math.abs(turnAngle) > 150) {
          type = 'u-turn';
          instructionText = `Make a U-turn and walk ${segmentDist} m`;
          subText = `Head back towards ${next.name}`;
        } else {
          type = 'straight';
          instructionText = `Walk straight for ${segmentDist} m`;
          subText = `Continue towards ${next.name}`;
        }
      }

      // Next preview
      let nextPreview: string | undefined;
      if (i + 2 < pathNodes.length) {
        const nextNext = pathNodes[i + 2];
        const nextB1 = calculateBearing({ lat: curr.lat, lng: curr.lng }, { lat: next.lat, lng: next.lng });
        const nextB2 = calculateBearing({ lat: next.lat, lng: next.lng }, { lat: nextNext.lat, lng: nextNext.lng });
        const nextAngle = calculateTurnAngle(nextB1, nextB2);
        if (nextAngle > 40) {
          nextPreview = `Turn right in ${segmentDist} m`;
        } else if (nextAngle < -40) {
          nextPreview = `Turn left in ${segmentDist} m`;
        } else {
          nextPreview = `Continue straight in ${segmentDist} m`;
        }
      } else {
        nextPreview = `Destination ahead in ${segmentDist} m`;
      }

      instructions.push({
        stepNumber: instructions.length + 1,
        type,
        instruction: instructionText,
        subInstruction: subText,
        distance: segmentDist,
        durationSeconds: Math.round(segmentDist / walkingSpeedMps),
        nodeId: curr.id,
        coordinates: { x: curr.x, y: curr.y },
        geoCoordinates: { latitude: curr.lat, longitude: curr.lng },
        floor: curr.floor,
        nextPreview,
      });
    }

    // Final Arrival step
    const finalNode = pathNodes[pathNodes.length - 1];
    instructions.push({
      stepNumber: instructions.length + 1,
      type: 'destination',
      instruction: `Arrive at ${destLoc.name}`,
      subInstruction: `${destLoc.building}${destLoc.room ? ` • ${destLoc.room}` : ''}`,
      distance: 0,
      durationSeconds: 0,
      nodeId: finalNode.id,
      coordinates: { x: finalNode.x, y: finalNode.y },
      geoCoordinates: { latitude: finalNode.lat, longitude: finalNode.lng },
      floor: finalNode.floor,
    });

    return instructions;
  }

  /**
   * Monitor user progress along active route, detect off-route deviation, and track arrival
   */
  public evaluateNavigationProgress(
    userGeo: GeoPoint,
    route: WalkableRouteResponse,
    currentStepIndex: number = 0
  ): RouteNavigationState {
    const destGeo: GeoPoint = {
      lat: route.destination.geoCoordinates.latitude,
      lng: route.destination.geoCoordinates.longitude,
    };

    // Calculate straight distance to destination
    const distanceToDestination = haversineDistanceMeters(userGeo, destGeo);

    // Arrival condition: within 15 meters of destination
    const hasArrived = distanceToDestination <= 15;

    // Nearest node to user
    const { node: closestNode } = this.findNearestNodeToGeo(userGeo);

    // Check deviation from route polyline
    let minDistanceToRoute = Infinity;
    const nodes = route.pathNodes;

    for (let i = 0; i < nodes.length - 1; i++) {
      const segA: GeoPoint = { lat: nodes[i].lat, lng: nodes[i].lng };
      const segB: GeoPoint = { lat: nodes[i + 1].lat, lng: nodes[i + 1].lng };
      const d = distanceToSegmentMeters(userGeo, segA, segB);
      if (d < minDistanceToRoute) {
        minDistanceToRoute = d;
      }
    }

    // Off-route threshold: > 28 meters from any path segment
    const isOffRoute = !hasArrived && minDistanceToRoute > 28;

    // Determine current active step by finding closest node in route
    let matchedStepIndex = currentStepIndex;
    let minStepDist = Infinity;
    route.instructions.forEach((instr, idx) => {
      const dist = haversineDistanceMeters(userGeo, {
        lat: instr.geoCoordinates.latitude,
        lng: instr.geoCoordinates.longitude,
      });
      // Allow forward progression
      if (dist < minStepDist && idx >= currentStepIndex - 1) {
        minStepDist = dist;
        matchedStepIndex = idx;
      }
    });

    // Advance step if user reached the current step waypoint (within 12 meters)
    if (matchedStepIndex < route.instructions.length - 1 && minStepDist <= 12) {
      matchedStepIndex = Math.min(route.instructions.length - 1, matchedStepIndex + 1);
    }

    // Calculate remaining distance along steps from matchedStepIndex
    let remainingDistance = 0;
    for (let i = matchedStepIndex; i < route.instructions.length; i++) {
      remainingDistance += route.instructions[i].distance;
    }
    if (hasArrived) remainingDistance = 0;

    const remainingMinutes = Math.max(0, Math.ceil((remainingDistance / 1.35) / 60));
    const activeInstruction = hasArrived
      ? route.instructions[route.instructions.length - 1]
      : route.instructions[matchedStepIndex] || route.instructions[0];
    const nextInstruction = matchedStepIndex + 1 < route.instructions.length
      ? route.instructions[matchedStepIndex + 1]
      : undefined;

    return {
      currentStepIndex: matchedStepIndex,
      currentInstruction: activeInstruction,
      nextInstruction,
      distanceRemainingMeters: Math.round(remainingDistance),
      estimatedMinutesRemaining: remainingMinutes,
      hasArrived,
      isOffRoute,
      distanceOffRouteMeters: Math.round(minDistanceToRoute),
      closestNodeId: closestNode.id,
      userCoordinates: gpsToCanvas(userGeo),
    };
  }

  private getOrdinal(n: number): string {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  }
}

export const routingService = new RoutingService();
