import express from 'express';
import { loginUser, registerUser, getUserProfile } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validateRegistration } from '../middleware/validation.js';

const router = express.Router();

router.post('/signup', validateRegistration, registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getUserProfile);

export default router;
