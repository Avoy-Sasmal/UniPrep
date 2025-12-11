import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, FileCheck, Presentation, GraduationCap, Brain } from 'lucide-react';
import api from '../services/api';
import NotesGenerator from '../components/content/NotesGenerator';
import ReportGenerator from '../components/content/ReportGenerator';
import PPTGenerator from '../components/content/PPTGenerator';
import ExamMode from '../components/exam/ExamMode';
import ContextManager from '../components/content/ContextManager';
import ContentList from '../components/content/ContentList';

const SubjectWorkspace = () => {
  const { id } = useParams();
  const [subject, setSubject] = useState(null);
  const [activeTab, setActiveTab] = useState('context');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubject();
  }, [id]);

  const fetchSubject = async () => {
    try {
      const response = await api.get(`/subjects/${id}`);
      setSubject(response.data);
    } catch (error) {
      console.error('Failed to fetch subject:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const tabs = [
    { id: 'context', label: 'Context', icon: FileText },
    { id: 'notes', label: 'Study Notes', icon: FileText },
    { id: 'report', label: 'Reports', icon: FileCheck },
    { id: 'ppt', label: 'PPT', icon: Presentation },
    { id: 'exam', label: 'Exam Mode', icon: GraduationCap },
    { id: 'content', label: 'My Content', icon: Brain }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">{subject?.name}</h1>
        {subject?.code && <p className="text-gray-600">Code: {subject.code}</p>}
      </div>

      {/* Tabs */}
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
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'context' && <ContextManager subjectId={id} />}
        {activeTab === 'notes' && <NotesGenerator subjectId={id} />}
        {activeTab === 'report' && <ReportGenerator subjectId={id} />}
        {activeTab === 'ppt' && <PPTGenerator subjectId={id} />}
        {activeTab === 'exam' && <ExamMode subjectId={id} />}
        {activeTab === 'content' && <ContentList subjectId={id} />}
      </div>
    </div>
  );
};

export default SubjectWorkspace;

