import { Router } from 'express';
import {
  calculateRouteHandler,
  getDirectionsHandler,
  recalculateRouteHandler,
  updateLocationHandler,
  getCampusGraphHandler,
} from '../controllers/navigationController';

const router = Router();

// POST /api/navigation/route - Calculate shortest walking route
router.post('/route', calculateRouteHandler);

// GET /api/navigation/directions - Return turn-by-turn instructions
router.get('/directions', getDirectionsHandler);

// POST /api/navigation/recalculate - Recalculate route when user deviates
router.post('/recalculate', recalculateRouteHandler);

// POST /api/navigation/location - Live GPS position ingestion & deviation tracking
router.post('/location', updateLocationHandler);

// GET /api/navigation/graph - Campus graph nodes & configuration
router.get('/graph', getCampusGraphHandler);

export default router;
