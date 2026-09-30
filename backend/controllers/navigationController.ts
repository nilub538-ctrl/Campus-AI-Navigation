import { Request, Response } from 'express';
import { routingService } from '../services/routingService';
import { CAMPUS_GEO_BOUNDS, gpsToCanvas } from '../utils/geoUtils';

// Active route cache in memory for tracking active sessions
const activeRoutesCache = new Map<string, any>();

/**
 * POST /api/navigation/route
 * Calculate the shortest walkable route from startLocation to destination
 */
export async function calculateRouteHandler(req: Request, res: Response) {
  try {
    const { startLocation, destination, accessibleMode = false } = req.body;

    if (!destination || (!destination.id && !destination.name)) {
      res.status(400).json({
        success: false,
        error: 'Destination is required (provide destination.id or destination.name)',
      });
      return;
    }

    const route = routingService.buildRoute({
      startLocation,
      destination,
      accessibleMode: Boolean(accessibleMode),
    });

    if (!route) {
      res.status(404).json({
        success: false,
        error: 'No walkable route is available to this destination.',
      });
      return;
    }

    // Cache route for session tracking
    activeRoutesCache.set(route.routeId, route);

    res.json({
      success: true,
      data: route,
      // Also return top-level convenience fields for the client
      route: route.pathNodes,
      distance: route.totalDistance,
      estimatedTime: route.estimatedMinutes,
      instructions: route.instructions,
    });
  } catch (err: any) {
    console.error('Error calculating route:', err);
    res.status(500).json({
      success: false,
      error: 'Navigation service temporarily unavailable. Please retry.',
      details: err?.message,
    });
  }
}

/**
 * GET /api/navigation/directions
 * Return turn-by-turn instructions for a specific routeId or source & destination
 */
export async function getDirectionsHandler(req: Request, res: Response) {
  try {
    const { routeId, destinationId, sourceNodeId, accessible } = req.query;

    if (routeId && activeRoutesCache.has(String(routeId))) {
      const cached = activeRoutesCache.get(String(routeId));
      res.json({
        success: true,
        routeId,
        instructions: cached.instructions,
        totalDistance: cached.totalDistance,
        estimatedMinutes: cached.estimatedMinutes,
      });
      return;
    }

    if (!destinationId) {
      res.status(400).json({
        success: false,
        error: 'destinationId or routeId is required',
      });
      return;
    }

    const route = routingService.buildRoute({
      startLocation: sourceNodeId ? { nodeId: String(sourceNodeId) } : undefined,
      destination: { id: String(destinationId) },
      accessibleMode: accessible === 'true',
    });

    if (!route) {
      res.status(404).json({
        success: false,
        error: 'No route available to generate directions for.',
      });
      return;
    }

    res.json({
      success: true,
      routeId: route.routeId,
      destination: route.destination,
      instructions: route.instructions,
      totalDistance: route.totalDistance,
      estimatedMinutes: route.estimatedMinutes,
    });
  } catch (err: any) {
    console.error('Error fetching directions:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve directions.',
    });
  }
}

/**
 * POST /api/navigation/recalculate
 * Recalculate shortest walkable route when user deviates from path
 */
export async function recalculateRouteHandler(req: Request, res: Response) {
  try {
    const { currentLocation, destinationId, accessibleMode = false, reason = 'User off-route' } = req.body;

    if (!destinationId) {
      res.status(400).json({
        success: false,
        error: 'destinationId is required for recalculation',
      });
      return;
    }

    const route = routingService.buildRoute({
      startLocation: currentLocation,
      destination: { id: destinationId },
      accessibleMode: Boolean(accessibleMode),
    });

    if (!route) {
      res.status(404).json({
        success: false,
        error: 'Unable to recalculate a walkable route from your current location.',
      });
      return;
    }

    activeRoutesCache.set(route.routeId, route);

    res.json({
      success: true,
      recalculated: true,
      reason,
      message: 'Route updated. Finding a better route...',
      data: route,
      route: route.pathNodes,
      distance: route.totalDistance,
      estimatedTime: route.estimatedMinutes,
      instructions: route.instructions,
    });
  } catch (err: any) {
    console.error('Error recalculating route:', err);
    res.status(500).json({
      success: false,
      error: 'Route recalculation failed. Please retry.',
    });
  }
}

/**
 * POST /api/navigation/location
 * Continuously track user position, verify path adherence, check arrival & auto-recalculate
 */
export async function updateLocationHandler(req: Request, res: Response) {
  try {
    const { 
      latitude, 
      longitude, 
      accuracy = 10, 
      timestamp = Date.now(), 
      routeId, 
      destinationId, 
      currentStepIndex = 0,
      accessibleMode = false 
    } = req.body;

    if (latitude === undefined || longitude === undefined) {
      res.status(400).json({
        success: false,
        error: 'latitude and longitude are required',
      });
      return;
    }

    const userGeo = { lat: Number(latitude), lng: Number(longitude) };
    const canvasCoord = gpsToCanvas(userGeo);

    // If an active route is provided, evaluate navigation progress
    let cachedRoute = routeId ? activeRoutesCache.get(routeId) : null;

    if (!cachedRoute && destinationId) {
      // Build route on demand
      cachedRoute = routingService.buildRoute({
        startLocation: { latitude: userGeo.lat, longitude: userGeo.lng },
        destination: { id: destinationId },
        accessibleMode,
      });
      if (cachedRoute) activeRoutesCache.set(cachedRoute.routeId, cachedRoute);
    }

    if (!cachedRoute) {
      // Just return nearest campus node and map coordinates
      const nearest = routingService.findNearestNodeToGeo(userGeo);
      res.json({
        success: true,
        userPosition: {
          latitude: userGeo.lat,
          longitude: userGeo.lng,
          accuracy,
          timestamp,
          canvas: canvasCoord,
          nearestCampusNode: nearest.node,
          distanceToNearestNodeMeters: nearest.distanceMeters,
        },
      });
      return;
    }

    // Evaluate progress against active route
    const state = routingService.evaluateNavigationProgress(
      userGeo,
      cachedRoute,
      Number(currentStepIndex) || 0
    );

    let recalculatedRoute: any = null;

    // If user has deviated from route significantly (> 28 meters) and not arrived, auto-recalculate
    if (state.isOffRoute && !state.hasArrived && destinationId) {
      recalculatedRoute = routingService.buildRoute({
        startLocation: { latitude: userGeo.lat, longitude: userGeo.lng },
        destination: { id: destinationId },
        accessibleMode,
      });
      if (recalculatedRoute) {
        activeRoutesCache.set(recalculatedRoute.routeId, recalculatedRoute);
      }
    }

    res.json({
      success: true,
      userPosition: {
        latitude: userGeo.lat,
        longitude: userGeo.lng,
        accuracy,
        timestamp,
        canvas: canvasCoord,
      },
      navigationState: state,
      shouldRecalculate: state.isOffRoute,
      recalculatedRoute,
    });
  } catch (err: any) {
    console.error('Error processing live location:', err);
    res.status(500).json({
      success: false,
      error: 'Location tracking error',
    });
  }
}

/**
 * GET /api/navigation/graph
 * Return graph nodes, edges, and campus bounds configuration
 */
export async function getCampusGraphHandler(_req: Request, res: Response) {
  res.json({
    success: true,
    data: {
      bounds: CAMPUS_GEO_BOUNDS,
      nodes: routingService.getAllNodes(),
      edges: routingService.getAllEdges(),
      totalNodes: routingService.getAllNodes().length,
      totalEdges: routingService.getAllEdges().length,
    },
  });
}

/**
 * GET /api/locations
 * Return all campus locations with optional filtering
 */
export async function getLocationsHandler(req: Request, res: Response) {
  const { category, search, building } = req.query;
  let list = routingService.getAllLocations();

  if (category && category !== 'All') {
    list = list.filter(l => l.category.toLowerCase() === String(category).toLowerCase());
  }

  if (building && building !== 'All') {
    list = list.filter(l => l.buildingId === building);
  }

  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(l =>
      l.name.toLowerCase().includes(q) ||
      l.building.toLowerCase().includes(q) ||
      l.code.toLowerCase().includes(q) ||
      l.tags.some(t => t.includes(q))
    );
  }

  res.json({
    success: true,
    count: list.length,
    data: list,
  });
}

/**
 * GET /api/locations/:id
 * Return details of a specific campus destination
 */
export async function getLocationDetailsHandler(req: Request, res: Response) {
  const { id } = req.params;
  const loc = routingService.getLocationById(id);

  if (!loc) {
    res.status(404).json({
      success: false,
      error: `Campus location '${id}' not found.`,
    });
    return;
  }

  res.json({
    success: true,
    data: loc,
  });
}
