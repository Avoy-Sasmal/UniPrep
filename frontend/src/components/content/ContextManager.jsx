import { useState, useEffect } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import api from '../services/api';

const ContextManager = ({ subjectId }) => {
  const [contexts, setContexts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    type: 'syllabus',
    title: '',
    content: '',
    topic: '',
    keywords: ''
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchContexts();
  }, [subjectId]);

  const fetchContexts = async () => {
    try {
      const response = await api.get(`/context/${subjectId}`);
      setContexts(response.data);
    } catch (error) {
      console.error('Failed to fetch contexts:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('subjectId', subjectId);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('topic', formData.topic);
      formDataToSend.append('keywords', formData.keywords);
      if (file) {
        formDataToSend.append('file', file);
      }

      await api.post('/context', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setShowModal(false);
      setFormData({ type: 'syllabus', title: '', content: '', topic: '', keywords: '' });
      setFile(null);
      fetchContexts();
    } catch (error) {
      alert('Failed to upload context');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this context?')) return;
    try {
      await api.delete(`/context/${id}`);
      fetchContexts();
    } catch (error) {
      alert('Failed to delete context');
    }
  };

  const typeLabels = {
    syllabus: 'Syllabus',
    pyq: 'Past Year Questions',
    notes: 'Notes',
    reference: 'Reference Material'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Context Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Upload size={20} />
          Upload Context
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contexts.map((context) => (
          <div key={context._id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {typeLabels[context.type]}
                </span>
                <h3 className="font-semibold mt-2">{context.title}</h3>
              </div>
              <button
                onClick={() => handleDelete(context._id)}
                className="text-red-600 hover:text-red-700"
              >
                <X size={18} />
              </button>
            </div>
            {context.metadata?.topic && (
              <p className="text-sm text-gray-600">Topic: {context.metadata.topic}</p>
            )}
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">
              {context.content.substring(0, 100)}...
            </p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Upload Context</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="syllabus">Syllabus</option>
                  <option value="pyq">Past Year Questions</option>
                  <option value="notes">Notes</option>
                  <option value="reference">Reference Material</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload File (PDF/Text) or Enter Content
                </label>
                <input
                  type="file"
                  accept=".pdf,.txt"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content (if not uploading file)
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows="6"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topic (Optional)
                </label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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

export default ContextManager;

