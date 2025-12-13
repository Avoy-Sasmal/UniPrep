import { useState, useEffect } from 'react';
import { ThumbsUp, MessageCircle, Eye, Plus, X, ArrowLeft } from 'lucide-react';
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
    content: ''
  });

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

      if (formData.file) fd.append('file', formData.file);
      else fd.append('content', formData.content);

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
      fetchPosts();
    } catch (e) {
      alert('Failed to create post');
    } finally {
      setSubmitting(false);
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
              {posts.map((post) => (
                <Link
                  key={post._id}
                  to={`/community/${post._id}`}
                  className="bg-white rounded-xl p-5 shadow hover:shadow-lg transition"
                >
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {typeLabels[post.type]}
                    </span>
                    <span className="flex items-center gap-1 text-gray-500">
                      <Eye size={14} /> {post.viewCount}
                    </span>
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
              ))}
            </div>
          )}
        </div>
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create Community Post</h2>
              <button onClick={() => setShowCreateModal(false)}>
                <X />
              </button>
            </div>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <input
                required
                placeholder="Title"
                className="w-full px-3 py-2 border rounded-md"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />

              <select
                className="w-full px-3 py-2 border rounded-md"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                {Object.entries(typeLabels).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>

              <textarea
                rows="5"
                placeholder="Enter content"
                className="w-full px-3 py-2 border rounded-md"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value, file: null })
                }
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              >
                {submitting ? 'Creating…' : 'Create Post'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
