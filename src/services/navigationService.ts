import { NavigationRoute, NavigationStep, UserLivePosition, LiveNavigationState, CampusLocation } from '../types/campus';
import { calculateRoute as calculateLocalRoute } from '../utils/dijkstra';

export interface RouteRequestParams {
  startLocation?: {
    latitude?: number;
    longitude?: number;
    nodeId?: string;
    id?: string;
  };
  destination: {
    id: string;
    name?: string;
  };
  accessibleMode?: boolean;
}

export interface BackendRouteResponse {
  success: boolean;
  routeId?: string;
  data?: any;
  route: any[];
  distance: number;
  estimatedTime: number;
  instructions: NavigationStep[];
  error?: string;
}

/**
 * Request walking route from Express backend REST API
 */
export async function fetchBackendRoute(
  params: RouteRequestParams,
  allLocations: CampusLocation[] = []
): Promise<NavigationRoute | null> {
  try {
    const res = await fetch('/api/navigation/route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        return {
          routeId: d.routeId,
          sourceId: d.source.nodeId,
          sourceName: d.source.name,
          destinationId: d.destination.id,
          destinationName: d.destination.name,
          totalDistance: d.totalDistance,
          estimatedMinutes: d.estimatedMinutes,
          estimatedSeconds: d.estimatedSeconds,
          pathNodes: d.pathNodes,
          steps: d.instructions.map((step: any) => ({
            stepNumber: step.stepNumber,
            instruction: step.instruction,
            subInstruction: step.subInstruction,
            distance: step.distance,
            durationSeconds: step.durationSeconds,
            type: step.type,
            nodeId: step.nodeId,
            coordinates: step.coordinates,
            geoCoordinates: step.geoCoordinates,
            floor: step.floor,
            nextPreview: step.nextPreview,
          })),
          isAccessible: Boolean(d.isAccessible),
        };
      }
    }
  } catch (err) {
    console.warn('Backend route calculation request failed, falling back to local engine:', err);
  }

  // Graceful fallback to client-side Dijkstra engine if backend is temporarily disconnected
  const fromId = params.startLocation?.nodeId || params.startLocation?.id || 'node_main_gate';
  return calculateLocalRoute(fromId, params.destination.id, params.accessibleMode, allLocations);
}

/**
 * Request route recalculation from Express backend REST API
 */
export async function recalculateBackendRoute(params: {
  currentLocation: { latitude: number; longitude: number };
  destinationId: string;
  accessibleMode?: boolean;
  reason?: string;
}): Promise<NavigationRoute | null> {
  try {
    const res = await fetch('/api/navigation/recalculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        return {
          routeId: d.routeId,
          sourceId: d.source.nodeId,
          sourceName: d.source.name,
          destinationId: d.destination.id,
          destinationName: d.destination.name,
          totalDistance: d.totalDistance,
          estimatedMinutes: d.estimatedMinutes,
          estimatedSeconds: d.estimatedSeconds,
          pathNodes: d.pathNodes,
          steps: d.instructions,
          isAccessible: Boolean(d.isAccessible),
        };
      }
    }
  } catch (err) {
    console.error('Backend recalculation failed:', err);
  }

  return null;
}

/**
 * Ingest live user location to backend for deviation tracking & progress evaluation
 */
export async function syncLocationWithBackend(params: {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  routeId?: string;
  destinationId?: string;
  currentStepIndex?: number;
  accessibleMode?: boolean;
}): Promise<{
  userPosition?: any;
  navigationState?: LiveNavigationState;
  shouldRecalculate?: boolean;
  recalculatedRoute?: NavigationRoute | null;
} | null> {
  try {
    const res = await fetch('/api/navigation/location', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success) {
        let recRoute: NavigationRoute | null = null;
        if (json.recalculatedRoute) {
          const d = json.recalculatedRoute;
          recRoute = {
            routeId: d.routeId,
            sourceId: d.source.nodeId,
            sourceName: d.source.name,
            destinationId: d.destination.id,
            destinationName: d.destination.name,
            totalDistance: d.totalDistance,
            estimatedMinutes: d.estimatedMinutes,
            estimatedSeconds: d.estimatedSeconds,
            pathNodes: d.pathNodes,
            steps: d.instructions,
            isAccessible: Boolean(d.isAccessible),
          };
        }

        return {
          userPosition: json.userPosition,
          navigationState: json.navigationState,
          shouldRecalculate: json.shouldRecalculate,
          recalculatedRoute: recRoute,
        };
      }
    }
  } catch (err) {
    // Silent fail for telemetry
  }
  return null;
}
