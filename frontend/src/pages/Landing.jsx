import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { BookOpen, Users, Award, Zap, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import Footer from '../components/layout/Footer';

const Landing = () => {
  const { isAuthenticated, fetchUser } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      fetchUser();
    } else {
      useAuthStore.setState({ isAuthenticated: false, user: null });
    }
  }, []);

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
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-white/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <BookOpen className="text-blue-600" size={28} />
              <span className="text-lg sm:text-2xl font-bold text-gray-800">
                UniPrep Copilot
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="hidden sm:block px-4 py-2 text-gray-700 hover:text-gray-900 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/login"
                    className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
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

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-10 sm:mb-12">
          Everything You Need to Excel
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/70 backdrop-blur-md border border-white/40 p-6 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 sm:py-20 bg-white/60 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                Why Choose UniPrep Copilot?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="text-green-600 mt-1" size={22} />
                    <p className="text-base sm:text-lg text-gray-700">
                      {benefit}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-6 sm:p-8 rounded-2xl">
              <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                  Get Started in 3 Steps
                </h3>
                <ol className="space-y-4">
                  {[
                    ['Create Your Account', 'Sign up with your email and university details'],
                    ['Add Your Subjects', 'Set up your subjects and preferences'],
                    ['Start Generating Content', 'Create notes and exam material instantly']
                  ].map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="bg-blue-600 text-white rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm sm:text-base">
                          {step[0]}
                        </p>
                        <p className="text-gray-600 text-sm sm:text-base">
                          {step[1]}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-700 via-indigo-600 to-purple-700 shadow-2xl">

          {/* Animated Background Blobs - Scaled down slightly */}
          <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-700" />

          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 mix-blend-overlay"></div>

          {/* Content Container - Reduced padding */}
          <div className="relative z-10 px-6 sm:px-10 py-10 sm:py-14 text-center">

            {/* Floating Icon - Slightly smaller margin */}
            <div className="inline-flex items-center justify-center p-3 mb-5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-inner transform transition-transform hover:scale-110 duration-300">
              <Sparkles className="text-yellow-300" size={28} />
            </div>

            {/* Heading - Reduced text size */}
            <h2 className="text-2xl sm:text-4xl font-bold mb-4 text-white tracking-tight leading-tight">
              Ready to Transform <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-purple-200">
                Your Studies?
              </span>
            </h2>

            {/* Paragraph - Reduced max-width and margin */}
            <p className="text-base sm:text-lg mb-8 text-blue-100/90 max-w-lg mx-auto leading-relaxed">
              Join thousands of students who are already using UniPrep Copilot to save time, reduce stress, and score higher.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to={isAuthenticated ? '/dashboard' : '/login'}
                className="group relative inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-700 text-base font-bold rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                {/* Button Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

                <span>{isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            <p className="mt-5 text-xs sm:text-sm text-blue-200/60 font-medium">
              No credit card required • Free plan available
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Landing;
