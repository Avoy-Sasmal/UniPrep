import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ThumbsUp, ThumbsDown, MessageCircle, Copy, Share2 } from 'lucide-react';
import api from '../services/api';
import useAuthStore from '../store/authStore';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCloneModal, setShowCloneModal] = useState(false);
  const [subjectId, setSubjectId] = useState('');

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await api.get(`/community/posts/${id}`);
      setPost(response.data);
    } catch (error) {
      console.error('Failed to fetch post:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await api.get(`/community/posts/${id}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleVote = async (voteType) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await api.post(`/community/posts/${id}/vote`, { voteType });
      fetchPost();
    } catch (error) {
      alert('Failed to vote');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await api.post(`/community/posts/${id}/comment`, { content: commentText });
      setCommentText('');
      fetchComments();
    } catch (error) {
      alert('Failed to post comment');
    }
  };

  const handleClone = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await api.post(`/community/posts/${id}/clone`, { subjectId });
      setShowCloneModal(false);
      alert('Content cloned to your workspace!');
      navigate(`/subjects/${subjectId}`);
    } catch (error) {
      alert('Failed to clone content');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!post) {
    return <div className="text-center py-12">Post not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          to="/community"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Community
        </Link>

        <div className="bg-white p-8 rounded-lg shadow">
          <div className="mb-6">
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {post.type}
            </span>
            <h1 className="text-3xl font-bold mt-4 mb-2">{post.title}</h1>
            <p className="text-gray-600">
              {post.metadata.university} • {post.metadata.branch} • Semester {post.metadata.semester}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {post.metadata.subject} • {post.metadata.topic}
            </p>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => handleVote('upvote')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <ThumbsUp size={20} />
              {post.upvotes}
            </button>
            <button
              onClick={() => handleVote('downvote')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <ThumbsDown size={20} />
              {post.downvotes}
            </button>
            {isAuthenticated && (
              <button
                onClick={() => setShowCloneModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Copy size={20} />
                Clone to Workspace
              </button>
            )}
          </div>

          <div className="prose max-w-none mb-8">
            {post.type === 'ppt' && post.content.slides ? (
              <div className="space-y-6">
                {post.content.slides.map((slide, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <h3 className="text-lg font-semibold mb-2">Slide {index + 1}: {slide.title}</h3>
                    <ul className="list-disc list-inside">
                      {slide.bullets?.map((bullet, bulletIndex) => (
                        <li key={bulletIndex}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : post.content.sections ? (
              <div>
                {post.content.sections.map((section, index) => (
                  <div key={index} className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
                    <p className="whitespace-pre-wrap">{section.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <pre className="whitespace-pre-wrap">{JSON.stringify(post.content, null, 2)}</pre>
            )}
          </div>

          {/* Comments */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Comments</h2>
            {isAuthenticated && (
              <form onSubmit={handleComment} className="mb-6">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Post Comment
                </button>
              </form>
            )}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment._id} className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium mb-1">{comment.userId?.name || 'Anonymous'}</p>
                  <p className="text-gray-700">{comment.content}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showCloneModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Clone to Workspace</h2>
            <p className="text-gray-600 mb-4">
              Select a subject to clone this content into your workspace.
            </p>
            <input
              type="text"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              placeholder="Subject ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={handleClone}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Clone
              </button>
              <button
                onClick={() => setShowCloneModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetail;

