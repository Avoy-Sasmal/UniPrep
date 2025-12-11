import express from 'express';
import {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject
} from '../controllers/subjectController.js';
import { authenticateAccessToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateAccessToken, getSubjects);
router.get('/:id', authenticateAccessToken, getSubjectById);
router.post('/', authenticateAccessToken, createSubject);
router.put('/:id', authenticateAccessToken, updateSubject);
router.delete('/:id', authenticateAccessToken, deleteSubject);

export default router;

