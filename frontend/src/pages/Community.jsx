import { useState, useEffect } from 'react';
import { ThumbsUp, MessageCircle, Eye, Plus, X, ArrowLeft, Cloud, Loader2, Trash2 } from 'lucide-react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [filters, setFilters] = useState({
    university: '',
    branch: '',
    semester: '',
    subject: '',
    type: ''
  });
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { user, isAuthenticated } = useAuthStore();

  const [formData, setFormData] = useState({
    title: '',
    type: 'notes',
    subject: '',
    topic: '',
    semester: user?.semester || '',
    university: user?.university || '',
    branch: user?.branch || '',
    file: null,
    content: '',
    cloudinaryUrl: null,
    cloudinaryPublicId: null
  });
  const [uploadingToCloudinary, setUploadingToCloudinary] = useState(false);

  useEffect(() => {
    fetchPosts();
    if (isAuthenticated && !user) {
      useAuthStore.getState().fetchUser();
    }
  }, [filters, isAuthenticated]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        semester: user.semester || prev.semester,
        university: user.university || prev.university,
        branch: user.branch || prev.branch
      }));
    }
  }, [user]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '')
      );
      const res = await api.get('/community/posts', { params });
      setPosts(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const typeLabels = {
    notes: 'Study Notes',
    report: 'Report',
    ppt: 'PPT',
    revision_sheet: 'Revision Sheet',
    mock_paper: 'Mock Paper'
  };

  const handleCloudinaryUpload = async (fileToUpload) => {
    if (!fileToUpload) return;
    
    setUploadingToCloudinary(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', fileToUpload);
      
      const response = await api.post('/cloudinary/upload', formDataToSend);
      
      setFormData(prev => ({
        ...prev,
        cloudinaryUrl: response.data.url,
        cloudinaryPublicId: response.data.public_id
      }));
      alert('File uploaded to Cloudinary successfully!');
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      alert('Failed to upload file to Cloudinary. You can still upload directly.');
    } finally {
      setUploadingToCloudinary(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!formData.title || !formData.subject || !formData.topic || !formData.semester) {
        alert('Please fill all required fields');
        setSubmitting(false);
        return;
      }

      const fd = new FormData();
      fd.append('type', formData.type);
      fd.append('title', formData.title);

      // Priority: Cloudinary URL > Direct file upload > Content
      if (formData.cloudinaryUrl) {
        fd.append('content', `[Cloudinary File]\nURL: ${formData.cloudinaryUrl}\nPublic ID: ${formData.cloudinaryPublicId}`);
      } else if (formData.file) {
        fd.append('file', formData.file);
      } else {
        fd.append('content', formData.content);
      }

      fd.append(
        'metadata',
        JSON.stringify({
          subject: formData.subject,
          topic: formData.topic,
          semester: parseInt(formData.semester),
          university: formData.university,
          branch: formData.branch
        })
      );

      await api.post('/community/posts', fd);
      
      setShowCreateModal(false);
      setFormData({
        title: '',
        type: 'notes',
        subject: '',
        topic: '',
        semester: user?.semester || '',
        university: user?.university || '',
        branch: user?.branch || '',
        file: null,
        content: '',
        cloudinaryUrl: null,
        cloudinaryPublicId: null
      });
      fetchPosts();
    } catch (e) {
      console.error('Create post error:', e);
      alert('Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async (postId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/community/posts/${postId}`);
      fetchPosts();
    } catch (error) {
      console.error('Delete post error:', error);
      alert(error.response?.data?.message || 'Failed to delete post');
    }
  };

  return (
    <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Community</h1>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mt-1"
            >
              <ArrowLeft size={14} /> Back to Dashboard
            </Link>
          </div>
          {isAuthenticated && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Plus size={18} /> Create Post
            </button>
          )}
        </div>
        <div className="bg-white px-4 sm:px-6 py-4 border rounded-lg">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {['University', 'Branch', 'Semester', 'Subject'].map((label) => (
              <input
                key={label}
                placeholder={label}
                className="px-3 py-2 border rounded-md text-sm"
                value={filters[label.toLowerCase()] || ''}
                onChange={(e) =>
                  setFilters({ ...filters, [label.toLowerCase()]: e.target.value })
                }
              />
            ))}
            <select
              className="px-3 py-2 border rounded-md text-sm"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="">All Types</option>
              {Object.entries(typeLabels).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          {loading ? (
            <div className="text-center py-20">Loading…</div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">
              No posts found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {posts.map((post) => {
                // Check if current user owns this post
                const postUserId = post.userId?._id || post.userId;
                const currentUserId = user?.id || user?._id;
                const isOwner = user && postUserId && postUserId.toString() === currentUserId?.toString();
                return (
                  <div
                    key={post._id}
                    className="bg-white rounded-xl p-5 shadow hover:shadow-lg transition relative"
                  >
                    <Link
                      to={`/community/${post._id}`}
                      className="block"
                    >
                      <div className="flex justify-between items-start mb-2 text-sm">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {typeLabels[post.type]}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 text-gray-500">
                            <Eye size={14} /> {post.viewCount}
                          </span>
                          {isOwner && (
                            <button
                              onClick={(e) => handleDeletePost(post._id, e)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Delete post"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{post.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {post.metadata.university} • {post.metadata.branch} • Sem {post.metadata.semester}
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        {post.metadata.subject} • {post.metadata.topic}
                      </p>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <ThumbsUp size={14} /> {post.upvotes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle size={14} /> Comments
                        </span>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create Community Post</h2>
              <button onClick={() => {
                setShowCreateModal(false);
                setFormData({
                  title: '',
                  type: 'notes',
                  subject: '',
                  topic: '',
                  semester: user?.semester || '',
                  university: user?.university || '',
                  branch: user?.branch || '',
                  file: null,
                  content: '',
                  cloudinaryUrl: null,
                  cloudinaryPublicId: null
                });
              }}>
                <X />
              </button>
            </div>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <input
                required
                placeholder="Title *"
                className="w-full px-3 py-2 border rounded-md"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  placeholder="Subject *"
                  className="px-3 py-2 border rounded-md"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
                <input
                  required
                  placeholder="Topic *"
                  className="px-3 py-2 border rounded-md"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                />
              </div>

              <select
                className="w-full px-3 py-2 border rounded-md"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                {Object.entries(typeLabels).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload File (Optional)
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept=".pdf,.txt,.doc,.docx,.jpg,.jpeg,.png,.mp4,.avi,.mov,.mkv,.webm,.mp3,.wav,.m4v"
                      onChange={(e) => {
                        const selectedFile = e.target.files[0];
                        if (selectedFile) {
                          setFormData(prev => ({
                            ...prev,
                            file: selectedFile,
                            cloudinaryUrl: null,
                            cloudinaryPublicId: null
                          }));
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    {formData.file && (
                      <button
                        type="button"
                        onClick={() => handleCloudinaryUpload(formData.file)}
                        disabled={uploadingToCloudinary}
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        {uploadingToCloudinary ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Cloud size={16} />
                            Upload to Cloudinary
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  {formData.cloudinaryUrl && (
                    <div className="p-2 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-green-700">
                          ✓ File uploaded to Cloudinary
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            const isPDF = formData.cloudinaryUrl.toLowerCase().includes('.pdf') || formData.cloudinaryUrl.includes('format=pdf');
                            if (isPDF) {
                              // Open PDF in new tab with viewer
                              window.open(formData.cloudinaryUrl, '_blank');
                            } else {
                              window.open(formData.cloudinaryUrl, '_blank');
                            }
                          }}
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 flex items-center gap-1"
                        >
                          <Eye size={14} />
                          View
                        </button>
                      </div>
                      {formData.file && formData.file.type === 'application/pdf' && (
                        <div className="mt-2">
                          <iframe
                            src={formData.cloudinaryUrl}
                            className="w-full h-64 border border-gray-300 rounded"
                            title="PDF Preview"
                          />
                        </div>
                      )}
                    </div>
                  )}
                  {formData.file && !formData.cloudinaryUrl && (
                    <p className="text-xs text-gray-500">
                      File selected: {formData.file.name} ({(formData.file.size / 1024).toFixed(2)} KB)
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content {formData.cloudinaryUrl || formData.file ? '(Optional if file uploaded)' : ''}
                </label>
                <textarea
                  rows="5"
                  placeholder="Enter content"
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                {(!formData.cloudinaryUrl && !formData.file && !formData.content) && (
                  <p className="text-xs text-red-500">
                    Please upload a file, upload to Cloudinary, or enter content
                  </p>
                )}
                <button
                  type="submit"
                  disabled={submitting || (!formData.cloudinaryUrl && !formData.file && !formData.content)}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Creating…' : 'Create Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
