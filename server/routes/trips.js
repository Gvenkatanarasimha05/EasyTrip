import express from 'express';
import { getTrips, createTrip, updateTrip, deleteTrip } from '../controllers/tripController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Protect all trip routes
router.use(authenticateToken);

router.get('/', getTrips);
router.post('/', createTrip);
router.put('/:id', updateTrip);
router.delete('/:id', deleteTrip);

export default router;