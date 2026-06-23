import express from 'express';
import { createBooking, getBookings, updateBookingStatus } from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';
import { validateBooking } from '../middleware/validation.js';

const router = express.Router();

router.route('/')
  .post(protect, validateBooking, createBooking)
  .get(protect, getBookings);

router.route('/:id')
  .patch(protect, updateBookingStatus);

export default router;
