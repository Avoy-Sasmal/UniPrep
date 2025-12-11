import { useState, useEffect } from 'react';
import { Search, ThumbsUp, MessageCircle, Eye } from 'lucide-react';
import api from '../services/api';
import { Link } from 'react-router-dom';

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

  useEffect(() => {
    fetchPosts();
  }, [filters]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Community</h1>
          
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
    </div>
  );
};

export default Community;

