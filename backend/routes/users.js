import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getUserProgress,
  getRecentContent
} from '../controllers/userController.js';
import { authenticateAccessToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', authenticateAccessToken, getUserProfile);
router.put('/profile', authenticateAccessToken, updateUserProfile);
router.get('/progress', authenticateAccessToken, getUserProgress);
router.get('/recent-content', authenticateAccessToken, getRecentContent);

export default router;

