import { useState } from 'react';
import { Presentation } from 'lucide-react';
import api from '../../services/api';

const PPTGenerator = ({ subjectId }) => {
  const [formData, setFormData] = useState({
    topic: '',
    slideCount: 10,
    presentationType: 'seminar',
    customPrompt: ''
  });
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/content/ppt', {
        subjectId,
        ...formData
      });
      setGeneratedContent(response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      if (errorMessage.includes('API key') || errorMessage.includes('authentication')) {
        alert('AI service is not properly configured. Please contact the administrator.');
      } else {
        alert('Failed to generate PPT: ' + errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Generate PPT Content</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Topic *
          </label>
          <input
            type="text"
            required
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            placeholder="e.g., Database Management Systems"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Slides
          </label>
          <input
            type="number"
            min="5"
            max="30"
            value={formData.slideCount}
            onChange={(e) => setFormData({ ...formData, slideCount: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Presentation Type
          </label>
          <select
            value={formData.presentationType}
            onChange={(e) => setFormData({ ...formData, presentationType: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="seminar">Seminar</option>
            <option value="viva">Viva</option>
            <option value="internal">Internal</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Special Details / Additional Instructions (Optional)
          </label>
          <textarea
            value={formData.customPrompt}
            onChange={(e) => setFormData({ ...formData, customPrompt: e.target.value })}
            placeholder="Add any specific requirements, focus areas, or special instructions for the AI..."
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Presentation size={20} />
          {loading ? 'Generating...' : 'Generate PPT'}
        </button>
      </form>

      {generatedContent && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">{generatedContent.title}</h3>
          <div className="space-y-6">
            {generatedContent.content.slides?.map((slide, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <h4 className="text-lg font-semibold mb-2">Slide {index + 1}: {slide.title}</h4>
                <ul className="list-disc list-inside mb-2">
                  {slide.bullets?.map((bullet, bulletIndex) => (
                    <li key={bulletIndex} className="text-gray-700">{bullet}</li>
                  ))}
                </ul>
                {slide.speakerNotes && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                    <strong>Speaker Notes:</strong> {slide.speakerNotes}
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

export default PPTGenerator;

