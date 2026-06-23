import express from 'express';
import { toggleFavorite, getFavorites, saveDiagnostics } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/favorites')
  .post(protect, toggleFavorite)
  .get(protect, getFavorites);

router.route('/diagnostics').put(protect, saveDiagnostics);

export default router;
