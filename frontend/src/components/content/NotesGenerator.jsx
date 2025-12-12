import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import api from '../../services/api';

const NotesGenerator = ({ subjectId }) => {
  const [formData, setFormData] = useState({
    topic: '',
    depth: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/content/notes', {
        subjectId,
        ...formData
      });
      setGeneratedContent(response.data);
    } catch (error) {
      alert('Failed to generate notes: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Generate Study Notes</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Topic/Unit *
          </label>
          <input
            type="text"
            required
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            placeholder="e.g., Data Structures, Operating Systems"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Depth Level
          </label>
          <select
            value={formData.depth}
            onChange={(e) => setFormData({ ...formData, depth: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="detailed">Detailed</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Sparkles size={20} />
          {loading ? 'Generating...' : 'Generate Notes'}
        </button>
      </form>

      {generatedContent && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">{generatedContent.title}</h3>
          <div className="prose max-w-none">
            {generatedContent.content.sections?.map((section, index) => (
              <div key={index} className="mb-6">
                <h4 className="text-lg font-semibold mb-2">{section.title}</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{section.content}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <a
              href={`/focus/notes/${generatedContent._id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Open in Focus Mode
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesGenerator;

