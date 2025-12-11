import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, TrendingUp, Clock, Award } from 'lucide-react';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [progressRes, sessionsRes] = await Promise.all([
        api.get('/users/progress'),
        api.get('/sessions?limit=5')
      ]);

      setStats(progressRes.data);
      setRecentSessions(sessionsRes.data);
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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Questions</p>
              <p className="text-2xl font-bold text-gray-800">{stats?.quiz?.totalQuestions || 0}</p>
            </div>
            <BookOpen className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Accuracy</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats?.quiz?.accuracy ? `${Math.round(stats.quiz.accuracy)}%` : '0%'}
              </p>
            </div>
            <TrendingUp className="text-green-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Study Streak</p>
              <p className="text-2xl font-bold text-gray-800">{stats?.studyStreak || 0} days</p>
            </div>
            <Award className="text-yellow-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Study Time</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats?.totalStudyTime ? `${Math.round(stats.totalStudyTime)}h` : '0h'}
              </p>
            </div>
            <Clock className="text-purple-600" size={32} />
          </div>
        </div>
      </div>

      {/* Charts */}
      {chartData.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Topic-wise Accuracy</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="topic" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="accuracy" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent Sessions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Study Sessions</h2>
        {recentSessions.length > 0 ? (
          <div className="space-y-3">
            {recentSessions.map((session) => (
              <div key={session._id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{session.subjectId?.name || 'Unknown Subject'}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(session.startTime).toLocaleString()} - {session.mode}
                  </p>
                </div>
                <div className="text-sm text-gray-600">
                  {session.duration ? `${Math.round(session.duration / 60000)} min` : 'Ongoing'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No recent sessions</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/subjects"
          className="bg-blue-600 text-white p-6 rounded-lg shadow hover:bg-blue-700 transition-colors"
        >
          <h3 className="text-xl font-semibold mb-2">Manage Subjects</h3>
          <p className="text-blue-100">Add or edit your subjects</p>
        </Link>
        <Link
          to="/community"
          className="bg-green-600 text-white p-6 rounded-lg shadow hover:bg-green-700 transition-colors"
        >
          <h3 className="text-xl font-semibold mb-2">Explore Community</h3>
          <p className="text-green-100">Discover shared content</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;

