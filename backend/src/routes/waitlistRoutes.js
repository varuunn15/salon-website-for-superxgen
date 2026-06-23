import express from 'express';
import { joinWaitlist } from '../controllers/waitlistController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, joinWaitlist);

export default router;
