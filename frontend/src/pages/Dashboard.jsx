import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, TrendingUp, Clock, Award, FileText } from 'lucide-react';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentSessions, setRecentSessions] = useState([]);
  const [recentContent, setRecentContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [progressRes, sessionsRes, contentRes] = await Promise.all([
        api.get('/users/progress'),
        api.get('/sessions?limit=5'),
        api.get('/users/recent-content?limit=5')
      ]);

      setStats(progressRes.data);
      setRecentSessions(sessionsRes.data);
      setRecentContent(contentRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const chartData = stats?.quiz?.topicAccuracy?.slice(0, 5).map(item => ({
    topic: item.topic.length > 15 ? item.topic.substring(0, 15) + '...' : item.topic,
    accuracy: Math.round(item.accuracy)
  })) || [];

  return (
    <div className="space-y-4 sm:space-y-6 w-full overflow-x-hidden">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 px-1">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-600 truncate">Total Questions</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">{stats?.quiz?.totalQuestions || 0}</p>
            </div>
            <BookOpen className="text-blue-600 flex-shrink-0 ml-2" size={24} />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-600 truncate">Accuracy</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">
                {stats?.quiz?.accuracy ? `${Math.round(stats.quiz.accuracy)}%` : '0%'}
              </p>
            </div>
            <TrendingUp className="text-green-600 flex-shrink-0 ml-2" size={24} />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-600 truncate">Study Streak</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">{stats?.studyStreak || 0} days</p>
            </div>
            <Award className="text-yellow-600 flex-shrink-0 ml-2" size={24} />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-600 truncate">Study Time</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">
                {stats?.totalStudyTime ? `${Math.round(stats.totalStudyTime)}h` : '0h'}
              </p>
            </div>
            <Clock className="text-purple-600 flex-shrink-0 ml-2" size={24} />
          </div>
        </div>
      </div>

      {/* Charts */}
      {chartData.length > 0 && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow overflow-hidden">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Topic-wise Accuracy</h2>
          <div className="w-full overflow-x-auto">
            <ResponsiveContainer width="100%" height={250} minHeight={200}>
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="topic" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                  tick={{ fontSize: 10 }}
                />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="accuracy" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent Generated Content */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Recently Generated Content</h2>
        {recentContent.length > 0 ? (
          <div className="space-y-3">
            {recentContent.map((content) => (
              <Link
                key={content._id}
                to={`/content/${content._id}`}
                className="flex items-start sm:items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors cursor-pointer gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded whitespace-nowrap">
                      {content.type === 'notes' ? 'Notes' : 
                       content.type === 'report' ? 'Report' :
                       content.type === 'ppt' ? 'PPT' :
                       content.type === 'revision_sheet' ? 'Revision Sheet' :
                       content.type === 'mock_paper' ? 'Mock Paper' : content.type}
                    </span>
                    <p className="font-medium text-gray-800 text-sm sm:text-base truncate">{content.title}</p>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">
                    <span className="font-medium">{content.subjectId?.name || 'Unknown Subject'}</span>
                    {content.topic && <span> • {content.topic}</span>}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(content.createdAt).toLocaleDateString()} at {new Date(content.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-blue-600 ml-2 flex-shrink-0">
                  →
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm sm:text-base">No content generated yet. Start by creating study materials in your subjects!</p>
        )}
      </div>

      {/* Recent Sessions */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Recent Study Sessions</h2>
        {recentSessions.length > 0 ? (
          <div className="space-y-3">
            {recentSessions.map((session) => (
              <div key={session._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm sm:text-base truncate">{session.subjectId?.name || session.contentId?.title || 'Unknown Subject'}</p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {new Date(session.startTime).toLocaleString()} - {session.mode}
                  </p>
                </div>
                <div className="text-xs sm:text-sm text-gray-600 flex-shrink-0">
                  {session.duration ? `${Math.round(session.duration / 60000)} min` : 'Ongoing'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm sm:text-base">No recent sessions</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <Link
          to="/subjects"
          className="bg-blue-600 text-white p-4 sm:p-6 rounded-lg shadow hover:bg-blue-700 transition-colors"
        >
          <h3 className="text-lg sm:text-xl font-semibold mb-2">Manage Subjects</h3>
          <p className="text-blue-100 text-sm sm:text-base">Add or edit your subjects</p>
        </Link>
        <Link
          to="/community"
          className="bg-green-600 text-white p-4 sm:p-6 rounded-lg shadow hover:bg-green-700 transition-colors"
        >
          <h3 className="text-lg sm:text-xl font-semibold mb-2">Explore Community</h3>
          <p className="text-green-100 text-sm sm:text-base">Discover shared content</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;

