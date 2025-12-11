import express from 'express';
import {
  getContentsBySubject,
  getContentById,
  generateNotesContent,
  generateReportContent,
  generatePPTContent,
  updateContent,
  deleteContent
} from '../controllers/contentController.js';
import { authenticateAccessToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/item/:id', authenticateAccessToken, getContentById);
router.get('/:subjectId', authenticateAccessToken, getContentsBySubject);
router.post('/notes', authenticateAccessToken, generateNotesContent);
router.post('/report', authenticateAccessToken, generateReportContent);
router.post('/ppt', authenticateAccessToken, generatePPTContent);
router.put('/:id', authenticateAccessToken, updateContent);
router.delete('/:id', authenticateAccessToken, deleteContent);

export default router;

