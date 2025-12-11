import { useState } from 'react';
import { FileText, Sparkles } from 'lucide-react';
import api from '../services/api';

const RapidSheetsGenerator = ({ subjectId }) => {
  const [formData, setFormData] = useState({
    topics: ''
  });
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const topicsArray = formData.topics.split(',').map(t => t.trim()).filter(t => t);
      const response = await api.post('/exam/rapid-sheets', {
        subjectId,
        topics: topicsArray.length > 0 ? topicsArray : undefined
      });
      setGeneratedContent(response.data);
    } catch (error) {
      alert('Failed to generate revision sheets: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Rapid Revision Sheets</h3>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Topics (comma-separated, leave empty for all topics)
          </label>
          <input
            type="text"
            value={formData.topics}
            onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
            placeholder="e.g., Arrays, Linked Lists, Trees"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Sparkles size={20} />
          {loading ? 'Generating...' : 'Generate Revision Sheets'}
        </button>
      </form>

      {generatedContent && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-lg font-semibold mb-4">{generatedContent.title}</h4>
          {generatedContent.content.keyPoints && (
            <div className="mb-6">
              <h5 className="font-semibold mb-2">Key Points</h5>
              <ul className="list-disc list-inside space-y-1">
                {generatedContent.content.keyPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          )}
          {generatedContent.content.formulae && generatedContent.content.formulae.length > 0 && (
            <div className="mb-6">
              <h5 className="font-semibold mb-2">Formulae</h5>
              <ul className="list-disc list-inside space-y-1">
                {generatedContent.content.formulae.map((formula, index) => (
                  <li key={index} className="font-mono">{formula}</li>
                ))}
              </ul>
            </div>
          )}
          {generatedContent.content.definitions && generatedContent.content.definitions.length > 0 && (
            <div>
              <h5 className="font-semibold mb-2">Definitions</h5>
              <div className="space-y-2">
                {generatedContent.content.definitions.map((def, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-3">
                    <strong>{def.term}:</strong> {def.definition}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RapidSheetsGenerator;

