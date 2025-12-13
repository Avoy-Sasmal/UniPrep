import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ThumbsUp, ThumbsDown, Copy } from 'lucide-react';
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
      const postData = response.data;
      
      // Parse content if it's a string
      if (typeof postData.content === 'string') {
        try {
          postData.content = JSON.parse(postData.content);
        } catch (e) {
          // If parsing fails, try to extract JSON from the string
          const jsonMatch = postData.content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            try {
              postData.content = JSON.parse(jsonMatch[0]);
            } catch (e2) {
              console.error('Failed to parse content:', e2);
            }
          }
        }
      }
      
      setPost(postData);
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
    <>
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
              {post.metadata?.university} • {post.metadata?.branch} • Semester {post.metadata?.semester}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {post.metadata?.subject} • {post.metadata?.topic}
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
            {(() => {
              // Ensure content is an object
              let content = post.content;
              if (typeof content === 'string') {
                try {
                  content = JSON.parse(content);
                } catch (e) {
                  // Try to extract JSON from string
                  const jsonMatch = content.match(/\{[\s\S]*\}/);
                  if (jsonMatch) {
                    try {
                      content = JSON.parse(jsonMatch[0]);
                    } catch (e2) {
                      return <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded">{content}</pre>;
                    }
                  } else {
                    return <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded">{content}</pre>;
                  }
                }
              }

              // Render based on content structure
              if (post.type === 'ppt' && content.slides) {
                return (
                  <div className="space-y-6">
                    {content.slides.map((slide, index) => (
                      <div key={index} className="border-l-4 border-purple-500 pl-6 py-4 bg-gray-50 rounded-lg">
                        <h3 className="text-xl font-semibold mb-3 text-gray-800">Slide {index + 1}: {slide.title}</h3>
                        {slide.bullets && slide.bullets.length > 0 && (
                          <ul className="list-disc list-inside space-y-2 text-gray-700">
                            {slide.bullets.map((bullet, bulletIndex) => (
                              <li key={bulletIndex}>{bullet}</li>
                            ))}
                          </ul>
                        )}
                        {slide.speakerNotes && (
                          <div className="mt-4 p-3 bg-white rounded border border-gray-200">
                            <p className="text-sm font-medium text-gray-600 mb-1">Speaker Notes:</p>
                            <p className="text-gray-700">{slide.speakerNotes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              } else if (content.sections && Array.isArray(content.sections)) {
                return (
                  <div className="space-y-6">
                    {content.sections.map((section, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-6 py-4 bg-gray-50 rounded-lg">
                        <h3 className="text-xl font-semibold mb-3 text-gray-800">{section.title}</h3>
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{section.content}</p>
                      </div>
                    ))}
                  </div>
                );
              } else if (content.questions && Array.isArray(content.questions)) {
                return (
                  <div className="space-y-6">
                    {content.questions.map((question, index) => (
                      <div key={index} className="border-l-4 border-green-500 pl-6 py-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start gap-3 mb-3">
                          <span className="text-xl font-bold text-green-600">Q{index + 1}.</span>
                          <p className="text-lg text-gray-800 flex-1">{question.question}</p>
                        </div>
                        {question.answer && (
                          <div className="ml-8 mt-4 p-4 bg-white rounded border border-gray-200">
                            <p className="text-sm font-medium text-gray-600 mb-2">Answer:</p>
                            <p className="text-gray-700 whitespace-pre-wrap">{question.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              } else if (content.keyPoints || content.formulae || content.definitions) {
                return (
                  <div className="space-y-6">
                    {content.keyPoints && content.keyPoints.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold mb-3 text-gray-800">Key Points</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                          {content.keyPoints.map((point, index) => (
                            <li key={index}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {content.formulae && content.formulae.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold mb-3 text-gray-800">Formulae</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                          {content.formulae.map((formula, index) => (
                            <li key={index}>{formula}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {content.definitions && content.definitions.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold mb-3 text-gray-800">Definitions</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                          {content.definitions.map((definition, index) => (
                            <li key={index}>{definition}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              } else {
                return (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">{JSON.stringify(content, null, 2)}</pre>
                  </div>
                );
              }
            })()}
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
    </>
  );
};

export default PostDetail;

