import express from 'express';
import {
  getQuizzes,
  createQuiz,
  submitQuizAttempt,
  getQuizAnalytics
} from '../controllers/quizController.js';
import { authenticateAccessToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/:subjectId', authenticateAccessToken, getQuizzes);
router.post('/', authenticateAccessToken, createQuiz);
router.post('/attempt', authenticateAccessToken, submitQuizAttempt);
router.get('/analytics/:subjectId', authenticateAccessToken, getQuizAnalytics);

export default router;

