import { Link } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const Header = () => {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">UniPrep Copilot</h1>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/profile" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
              <User size={20} />
              <span>{user?.name || 'User'}</span>
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-gray-700 hover:text-red-600"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

