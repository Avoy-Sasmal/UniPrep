import express from 'express';
import {
  listCommunityPosts,
  getCommunityPost,
  createCommunityPost,
  voteCommunityPost,
  commentOnPost,
  getPostComments,
  cloneCommunityPost,
  reportCommunityPost
} from '../controllers/communityController.js';
import { authenticateAccessToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/posts', listCommunityPosts);
router.get('/posts/:id', getCommunityPost);
router.post('/posts', authenticateAccessToken, createCommunityPost);
router.post('/posts/:id/vote', authenticateAccessToken, voteCommunityPost);
router.post('/posts/:id/comment', authenticateAccessToken, commentOnPost);
router.get('/posts/:id/comments', getPostComments);
router.post('/posts/:id/clone', authenticateAccessToken, cloneCommunityPost);
router.post('/posts/:id/report', authenticateAccessToken, reportCommunityPost);

export default router;

