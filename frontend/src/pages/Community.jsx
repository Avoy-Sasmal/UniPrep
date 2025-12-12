import { useState, useEffect } from 'react';
import { Search, ThumbsUp, MessageCircle, Eye, Plus, Upload, X } from 'lucide-react';
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
    // Fetch user data if authenticated
    if (isAuthenticated && !user) {
      useAuthStore.getState().fetchUser();
    }
  }, [filters, isAuthenticated]);

  useEffect(() => {
    // Update form data when user is loaded
    if (user) {
      setFormData(prev => ({
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
      const response = await api.get('/community/posts', { params });
      setPosts(response.data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
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
      // Validate required fields
      if (!formData.title || !formData.subject || !formData.topic || !formData.semester) {
        alert('Please fill in all required fields (Title, Subject, Topic, Semester)');
        setSubmitting(false);
        return;
      }

      const postFormData = new FormData();
      postFormData.append('type', formData.type);
      postFormData.append('title', formData.title);
      
      if (formData.file) {
        postFormData.append('file', formData.file);
      } else if (formData.content) {
        postFormData.append('content', formData.content);
      } else {
        alert('Please either upload a file or enter content');
        setSubmitting(false);
        return;
      }

      const metadata = {
        subject: formData.subject,
        topic: formData.topic,
        semester: parseInt(formData.semester, 10),
        university: formData.university,
        branch: formData.branch
      };
      postFormData.append('metadata', JSON.stringify(metadata));

      await api.post('/community/posts', postFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('Post created successfully!');
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
        content: ''
      });
      fetchPosts();
    } catch (error) {
      alert('Failed to create post: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800">Community</h1>
            {isAuthenticated && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Plus size={20} />
                Create Post
              </button>
            )}
          </div>
          
          {/* Filters */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="University"
              value={filters.university}
              onChange={(e) => setFilters({ ...filters, university: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Branch"
              value={filters.branch}
              onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              placeholder="Semester"
              value={filters.semester}
              onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Subject"
              value={filters.subject}
              onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Types</option>
              <option value="notes">Notes</option>
              <option value="report">Reports</option>
              <option value="ppt">PPT</option>
              <option value="revision_sheet">Revision Sheets</option>
              <option value="mock_paper">Mock Papers</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600">No posts found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post._id}
                to={`/community/${post._id}`}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {typeLabels[post.type]}
                  </span>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Eye size={16} />
                    {post.viewCount}
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                <p className="text-sm text-gray-600 mb-3">
                  {post.metadata.university} • {post.metadata.branch} • Sem {post.metadata.semester}
                </p>
                <p className="text-sm text-gray-500 mb-4">{post.metadata.subject} • {post.metadata.topic}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <ThumbsUp size={16} />
                    {post.upvotes}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle size={16} />
                    Comments
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Create Community Post</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Operating Systems - CPU Scheduling Notes"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="notes">Study Notes</option>
                  <option value="report">Report</option>
                  <option value="ppt">PPT</option>
                  <option value="revision_sheet">Revision Sheet</option>
                  <option value="mock_paper">Mock Paper</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g., Operating System"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Topic *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    placeholder="e.g., CPU Scheduling"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Semester *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    required
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    University
                  </label>
                  <input
                    type="text"
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    placeholder="e.g., MAKAUT"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Branch
                  </label>
                  <input
                    type="text"
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    placeholder="e.g., AIML"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload File (PDF, DOCX, PPT) or Enter Content
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setFormData({ ...formData, file, content: '' });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {formData.file && (
                  <p className="text-sm text-gray-600 mt-1">
                    Selected: {formData.file.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Or Enter Content Manually (if not uploading file)
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value, file: null })}
                  rows="6"
                  placeholder="Enter your content here..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  disabled={!!formData.file}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Upload size={20} />
                  {submitting ? 'Creating...' : 'Create Post'}
                </button>
                <button
                  type="button"
                  onClick={() => {
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
                      content: ''
                    });
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
                >
                  Cancel
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

