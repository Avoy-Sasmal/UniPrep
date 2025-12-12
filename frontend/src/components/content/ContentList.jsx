import { useState, useEffect } from 'react';
import { FileText, Eye, Trash2, Share2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';

const ContentList = ({ subjectId }) => {
  const [contents, setContents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [sharingContent, setSharingContent] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchContents();
    // Fetch user data if not available
    if (!user) {
      useAuthStore.getState().fetchUser();
    }
  }, [subjectId, filter, user]);

  const fetchContents = async () => {
    try {
      const params = filter !== 'all' ? { type: filter } : {};
      const response = await api.get(`/content/${subjectId}`, { params });
      // Ensure subjectId is set for each content item
      const contentsWithSubject = response.data.map(content => ({
        ...content,
        subjectId: content.subjectId || { _id: subjectId }
      }));
      setContents(contentsWithSubject);
    } catch (error) {
      console.error('Failed to fetch contents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this content?')) return;
    try {
      await api.delete(`/content/${id}`);
      fetchContents();
    } catch (error) {
      alert('Failed to delete content');
    }
  };

  const handleShareToCommunity = (content) => {
    setSharingContent(content);
    setShowShareModal(true);
  };

  const handleShareSubmit = async (e) => {
    e.preventDefault();
    if (!sharingContent) return;

    const form = e.target;
    const formData = new FormData(form);
    
    try {
      // Get form values
      const title = formData.get('title') || sharingContent.title;
      const subject = formData.get('subject') || sharingContent.subjectId?.name || 'Unknown';
      const topic = formData.get('topic') || sharingContent.topic;

      const postData = new FormData();
      postData.append('contentId', sharingContent._id);
      postData.append('type', sharingContent.type);
      postData.append('title', title);
      postData.append('content', JSON.stringify(sharingContent.content));
      
      const metadata = {
        subject: subject,
        topic: topic,
        semester: user?.semester || '',
        university: user?.university || '',
        branch: user?.branch || ''
      };
      postData.append('metadata', JSON.stringify(metadata));

      await api.post('/community/posts', postData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('Content shared to community successfully!');
      setShowShareModal(false);
      setSharingContent(null);
    } catch (error) {
      alert('Failed to share content: ' + (error.response?.data?.message || error.message));
    }
  };

  const typeLabels = {
    notes: 'Study Notes',
    report: 'Report',
    ppt: 'PPT',
    revision_sheet: 'Revision Sheet',
    mock_paper: 'Mock Paper'
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">My Generated Content</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="all">All Types</option>
          <option value="notes">Notes</option>
          <option value="report">Reports</option>
          <option value="ppt">PPT</option>
          <option value="revision_sheet">Revision Sheets</option>
          <option value="mock_paper">Mock Papers</option>
        </select>
      </div>

      {contents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No content generated yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {contents.map((content) => (
            <div 
              key={content._id} 
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/content/${content._id}`)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {typeLabels[content.type]}
                  </span>
                  <h3 className="text-xl font-semibold mt-2">{content.title}</h3>
                  <p className="text-sm text-gray-600">Topic: {content.topic}</p>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(content.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <Link
                    to={`/focus/${content.type}/${content._id}`}
                    className="text-blue-600 hover:text-blue-700 p-2 rounded hover:bg-blue-50"
                    title="View in Focus Mode"
                  >
                    <Eye size={20} />
                  </Link>
                  <button
                    onClick={() => handleShareToCommunity(content)}
                    className="text-green-600 hover:text-green-700 p-2 rounded hover:bg-green-50"
                    title="Share to Community"
                  >
                    <Share2 size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(content._id)}
                    className="text-red-600 hover:text-red-700 p-2 rounded hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Share to Community Modal */}
      {showShareModal && sharingContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Share to Community</h2>
            <form onSubmit={handleShareSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={sharingContent.title}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  required
                  defaultValue={sharingContent.subjectId?.name || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topic *
                </label>
                <input
                  type="text"
                  name="topic"
                  required
                  defaultValue={sharingContent.topic}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                >
                  Share
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowShareModal(false);
                    setSharingContent(null);
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

export default ContentList;

