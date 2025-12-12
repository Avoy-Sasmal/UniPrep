import { useState, useEffect } from 'react';
import { FileText, Eye, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const ContentList = ({ subjectId }) => {
  const [contents, setContents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContents();
  }, [subjectId, filter]);

  const fetchContents = async () => {
    try {
      const params = filter !== 'all' ? { type: filter } : {};
      const response = await api.get(`/content/${subjectId}`, { params });
      setContents(response.data);
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
            <div key={content._id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {typeLabels[content.type]}
                  </span>
                  <h3 className="text-xl font-semibold mt-2">{content.title}</h3>
                  <p className="text-sm text-gray-600">Topic: {content.topic}</p>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(content.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/focus/${content.type}/${content._id}`}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Eye size={20} />
                  </Link>
                  <button
                    onClick={() => handleDelete(content._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentList;

