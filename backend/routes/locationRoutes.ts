import { Router } from 'express';
import {
  getLocationsHandler,
  getLocationDetailsHandler,
} from '../controllers/navigationController';

const router = Router();

// GET /api/locations - List campus locations
router.get('/', getLocationsHandler);

// GET /api/locations/:id - Details of specific location
router.get('/:id', getLocationDetailsHandler);

export default router;
