import CommunityPost from '../models/CommunityPost.js';
import CommunityVote from '../models/CommunityVote.js';
import CommunityComment from '../models/CommunityComment.js';
import GeneratedContent from '../models/GeneratedContent.js';
import User from '../models/User.js';

export const listCommunityPosts = async (req, res) => {
  try {
    const { university, branch, semester, subject, topic, type, limit = 20, skip = 0 } =
      req.query;
    const query = { status: 'active' };

    if (university) query['metadata.university'] = university;
    if (branch) query['metadata.branch'] = branch;
    if (semester) query['metadata.semester'] = parseInt(semester, 10);
    if (subject) query['metadata.subject'] = subject;
    if (topic) query['metadata.topic'] = { $regex: topic, $options: 'i' };
    if (type) query.type = type;

    const posts = await CommunityPost.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit, 10))
      .skip(parseInt(skip, 10))
      .populate('userId', 'name university branch')
      .select('-content');

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCommunityPost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id)
      .populate('userId', 'name university branch')
      .populate('contentId');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.viewCount++;
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCommunityPost = async (req, res) => {
  try {
    const { contentId, type, title, content, metadata } = req.body;
    const user = await User.findById(req.userId);

    const post = new CommunityPost({
      userId: req.userId,
      contentId,
      type,
      title,
      content,
      metadata: {
        ...metadata,
        university: metadata?.university || user.university,
        branch: metadata?.branch || user.branch,
        semester: metadata?.semester || user.semester
      }
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const voteCommunityPost = async (req, res) => {
  try {
    const { voteType } = req.body;
    const postId = req.params.id;
    let vote = await CommunityVote.findOne({ userId: req.userId, postId });
    const post = await CommunityPost.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (vote) {
      if (vote.voteType !== voteType) {
        if (vote.voteType === 'upvote') {
          post.upvotes--;
        } else {
          post.downvotes--;
        }
        if (voteType === 'upvote') {
          post.upvotes++;
        } else {
          post.downvotes++;
        }
        vote.voteType = voteType;
        await vote.save();
      }
    } else {
      vote = new CommunityVote({
        userId: req.userId,
        postId,
        voteType
      });
      await vote.save();

      if (voteType === 'upvote') {
        post.upvotes++;
      } else {
        post.downvotes++;
      }
    }

    await post.save();
    res.json({ upvotes: post.upvotes, downvotes: post.downvotes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const commentOnPost = async (req, res) => {
  try {
    const { content } = req.body;
    const comment = new CommunityComment({
      userId: req.userId,
      postId: req.params.id,
      content
    });

    await comment.save();
    await comment.populate('userId', 'name');

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPostComments = async (req, res) => {
  try {
    const comments = await CommunityComment.find({ postId: req.params.id })
      .sort({ createdAt: 1 })
      .populate('userId', 'name');
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cloneCommunityPost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    let sourceContent;
    if (post.contentId) {
      sourceContent = await GeneratedContent.findById(post.contentId);
    }

    const clonedContent = new GeneratedContent({
      userId: req.userId,
      subjectId: req.body.subjectId,
      type: post.type,
      title: `${post.title} (Cloned)`,
      topic: post.metadata.topic,
      content: sourceContent ? sourceContent.content : post.content,
      metadata: {
        generatedAt: new Date()
      }
    });

    await clonedContent.save();
    res.status(201).json(clonedContent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const reportCommunityPost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.reportedCount++;
    if (post.reportedCount >= 5) {
      post.status = 'reported';
    }
    await post.save();

    res.json({ message: 'Post reported' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

