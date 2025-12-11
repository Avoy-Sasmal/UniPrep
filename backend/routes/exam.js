import express from 'express';
import {
  generateExamBlueprint,
  generateRevisionPlanner,
  generateRapidRevisionSheets,
  generateMockPaper,
  getExamPlans
} from '../controllers/examController.js';
import { authenticateAccessToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/blueprint', authenticateAccessToken, generateExamBlueprint);
router.post('/planner', authenticateAccessToken, generateRevisionPlanner);
router.post('/rapid-sheets', authenticateAccessToken, generateRapidRevisionSheets);
router.post('/mock-paper', authenticateAccessToken, generateMockPaper);
router.get('/plans/:subjectId', authenticateAccessToken, getExamPlans);

export default router;

