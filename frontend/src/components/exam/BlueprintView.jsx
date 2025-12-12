import { useState } from 'react';
import { Sparkles, TrendingUp } from 'lucide-react';
import api from '../../services/api';

const BlueprintView = ({ subjectId, examPlan, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      await api.post('/exam/blueprint', { subjectId });
      onUpdate();
    } catch (error) {
      alert('Failed to generate blueprint: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Exam Blueprint</h3>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
        >
          <Sparkles size={20} />
          {loading ? 'Generating...' : 'Generate Blueprint'}
        </button>
      </div>

      {examPlan?.blueprint?.units ? (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="space-y-4">
            {examPlan.blueprint.units.map((unit, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-semibold">{unit.name}</h4>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      Weightage: {unit.weightage}%
                    </span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      unit.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                      unit.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {unit.difficulty}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Frequency: {unit.frequency} questions
                </p>
                {unit.importantTopics && unit.importantTopics.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-1">Important Topics:</p>
                    <div className="flex flex-wrap gap-2">
                      {unit.importantTopics.map((topic, topicIndex) => (
                        <span
                          key={topicIndex}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <TrendingUp size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No blueprint generated yet. Click "Generate Blueprint" to get started.</p>
        </div>
      )}
    </div>
  );
};

export default BlueprintView;

