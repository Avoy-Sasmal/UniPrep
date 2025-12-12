import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, Zap, ArrowRight, CheckCircle } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Landing = () => {
  const { isAuthenticated, fetchUser } = useAuthStore();

  useEffect(() => {
    // Check authentication status on mount
    const token = localStorage.getItem('accessToken');
    if (token) {
      fetchUser();
    } else {
      // Ensure state is cleared if no token
      useAuthStore.setState({ isAuthenticated: false, user: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  const features = [
    {
      icon: <BookOpen className="text-blue-600" size={32} />,
      title: 'AI-Powered Study Notes',
      description: 'Generate comprehensive study notes tailored to your syllabus and learning style.'
    },
    {
      icon: <Zap className="text-yellow-600" size={32} />,
      title: 'Smart Exam Preparation',
      description: 'Create exam blueprints, revision planners, and mock papers with AI assistance.'
    },
    {
      icon: <Users className="text-green-600" size={32} />,
      title: 'Community Sharing',
      description: 'Share your study materials and discover content from other students.'
    },
    {
      icon: <Award className="text-purple-600" size={32} />,
      title: 'Personalized Learning',
      description: 'Customize answer styles and track your progress across all subjects.'
    }
  ];

  const benefits = [
    'Generate study notes in seconds',
    'Create exam blueprints automatically',
    'Share and discover community content',
    'Track your study progress',
    'Customize your learning style',
    'Access from anywhere, anytime'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <BookOpen className="text-blue-600" size={32} />
              <span className="text-2xl font-bold text-gray-800">UniPrep Copilot</span>
            </div>
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/login"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your AI-Powered
            <span className="text-blue-600"> Study Companion</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Generate comprehensive study notes, exam blueprints, and revision materials in seconds. 
            Join a community of students sharing knowledge and accelerating their learning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  Get Started Free
                  <ArrowRight size={20} />
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-white text-blue-600 text-lg rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors"
                >
                  Sign In
                </Link>
              </>
            ) : (
              <Link
                to="/dashboard"
                className="px-8 py-4 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                Go to Dashboard
                <ArrowRight size={20} />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything You Need to Excel
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why Choose UniPrep Copilot?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={24} />
                    <p className="text-lg text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-8 rounded-lg">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Get Started in 3 Steps</h3>
                <ol className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</span>
                    <div>
                      <p className="font-semibold text-gray-800">Create Your Account</p>
                      <p className="text-gray-600">Sign up with your email and university details</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2</span>
                    <div>
                      <p className="font-semibold text-gray-800">Add Your Subjects</p>
                      <p className="text-gray-600">Set up your subjects and customize your preferences</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3</span>
                    <div>
                      <p className="font-semibold text-gray-800">Start Generating Content</p>
                      <p className="text-gray-600">Create study notes, reports, and exam materials instantly</p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Studies?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of students already using UniPrep Copilot to excel in their exams
          </p>
          {!isAuthenticated ? (
            <Link
              to="/login"
              className="inline-block px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Get Started Free
            </Link>
          ) : (
            <Link
              to="/dashboard"
              className="inline-block px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 UniPrep Copilot. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

