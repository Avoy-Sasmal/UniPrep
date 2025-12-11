import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getUserProgress
} from '../controllers/userController.js';
import { authenticateAccessToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', authenticateAccessToken, getUserProfile);
router.put('/profile', authenticateAccessToken, updateUserProfile);
router.get('/progress', authenticateAccessToken, getUserProgress);

export default router;

