import { useState, useEffect } from 'react';
import { GraduationCap, Calendar, FileText, BookOpen } from 'lucide-react';
import api from '../services/api';
import BlueprintView from './BlueprintView';
import PlannerView from './PlannerView';
import RapidSheetsGenerator from './RapidSheetsGenerator';
import MockPaperGenerator from './MockPaperGenerator';

const ExamMode = ({ subjectId }) => {
  const [activeTab, setActiveTab] = useState('blueprint');
  const [examPlan, setExamPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExamPlan();
  }, [subjectId]);

  const fetchExamPlan = async () => {
    try {
      const response = await api.get(`/exam/plans/${subjectId}`);
      setExamPlan(response.data);
    } catch (error) {
      console.error('Failed to fetch exam plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'blueprint', label: 'Exam Blueprint', icon: GraduationCap },
    { id: 'planner', label: 'Revision Planner', icon: Calendar },
    { id: 'rapid', label: 'Rapid Sheets', icon: FileText },
    { id: 'mock', label: 'Mock Paper', icon: BookOpen }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Exam Preparation Mode</h2>

      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'blueprint' && (
          <BlueprintView subjectId={subjectId} examPlan={examPlan} onUpdate={fetchExamPlan} />
        )}
        {activeTab === 'planner' && (
          <PlannerView subjectId={subjectId} examPlan={examPlan} onUpdate={fetchExamPlan} />
        )}
        {activeTab === 'rapid' && <RapidSheetsGenerator subjectId={subjectId} />}
        {activeTab === 'mock' && <MockPaperGenerator subjectId={subjectId} />}
      </div>
    </div>
  );
};

export default ExamMode;

