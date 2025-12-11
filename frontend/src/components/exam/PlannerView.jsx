import { useState } from 'react';
import { Calendar, Sparkles } from 'lucide-react';
import api from '../services/api';

const PlannerView = ({ subjectId, examPlan, onUpdate }) => {
  const [formData, setFormData] = useState({
    examDate: '',
    hoursPerDay: 3
  });
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!examPlan?.blueprint) {
      alert('Please generate exam blueprint first');
      return;
    }
    setLoading(true);
    try {
      await api.post('/exam/planner', {
        subjectId,
        ...formData
      });
      onUpdate();
    } catch (error) {
      alert('Failed to generate planner: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Revision Planner</h3>

      {!examPlan?.blueprint && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg">
          Please generate an exam blueprint first before creating a revision planner.
        </div>
      )}

      <form onSubmit={handleGenerate} className="bg-white p-6 rounded-lg shadow space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Exam Date *
          </label>
          <input
            type="date"
            required
            value={formData.examDate}
            onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hours Per Day
          </label>
          <input
            type="number"
            min="1"
            max="12"
            value={formData.hoursPerDay}
            onChange={(e) => setFormData({ ...formData, hoursPerDay: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !examPlan?.blueprint}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Sparkles size={20} />
          {loading ? 'Generating...' : 'Generate Planner'}
        </button>
      </form>

      {examPlan?.revisionPlan?.days && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-lg font-semibold mb-4">Revision Schedule</h4>
          <div className="space-y-3">
            {examPlan.revisionPlan.days.map((day, index) => (
              <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">
                      {new Date(day.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Topics: {day.topics.join(', ')}
                    </p>
                    {day.tasks && day.tasks.length > 0 && (
                      <ul className="text-sm text-gray-600 mt-1">
                        {day.tasks.map((task, taskIndex) => (
                          <li key={taskIndex}>• {task}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{day.hours}h</span>
                </div>
              </div>
            ))}
          </div>
          {examPlan.revisionPlan.mockTestDays && examPlan.revisionPlan.mockTestDays.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <p className="font-medium mb-2">Mock Test Days:</p>
              <div className="flex flex-wrap gap-2">
                {examPlan.revisionPlan.mockTestDays.map((date, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">
                    {new Date(date).toLocaleDateString()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlannerView;

