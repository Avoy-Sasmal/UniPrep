import { useState } from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import api from '../../services/api';

const MockPaperGenerator = ({ subjectId }) => {
  const [formData, setFormData] = useState({
    shortCount: 5,
    longCount: 3
  });
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/exam/mock-paper', {
        subjectId,
        ...formData
      });
      setGeneratedContent(response.data);
    } catch (error) {
      alert('Failed to generate mock paper: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Mock Paper Generator</h3>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Short Answer Questions
            </label>
            <input
              type="number"
              min="0"
              max="20"
              value={formData.shortCount}
              onChange={(e) => setFormData({ ...formData, shortCount: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Long Answer Questions
            </label>
            <input
              type="number"
              min="0"
              max="10"
              value={formData.longCount}
              onChange={(e) => setFormData({ ...formData, longCount: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Sparkles size={20} />
          {loading ? 'Generating...' : 'Generate Mock Paper'}
        </button>
      </form>

      {generatedContent && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-lg font-semibold mb-4">{generatedContent.title}</h4>
          <div className="space-y-6">
            {generatedContent.content.questions?.map((question, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <div className="flex items-start gap-2 mb-2">
                  <span className="font-semibold">Q{index + 1}.</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    question.type === 'short' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {question.type === 'short' ? 'Short Answer' : 'Long Answer'}
                  </span>
                </div>
                <p className="mb-3">{question.question}</p>
                {question.answer && (
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm font-medium mb-1">Answer:</p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{question.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MockPaperGenerator;

