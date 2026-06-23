import express from 'express';
import { getSalons, getSalonById, syncSalons } from '../controllers/salonController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(getSalons);
router.route('/sync').post(protect, syncSalons);
router.route('/:id').get(getSalonById);

export default router;
