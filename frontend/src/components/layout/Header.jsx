import { Link } from "react-router-dom";
import { LogOut, User, Menu, X } from "lucide-react";
import useAuthStore from "../../store/authStore";
import { BookOpen } from "lucide-react";

const Header = ({ onToggleSidebar, sidebarOpen }) => {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            {/* Mobile Menu Button - Only show on mobile */}
            <button
              type="button"
              aria-label={sidebarOpen ? "Close menu" : "Open menu"}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onToggleSidebar) {
                  onToggleSidebar();
                }
              }}
              className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation relative z-50"
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            
            {/* Logo - Responsive sizing */}
            <Link 
              to="/dashboard" 
              className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-shrink-0"
            >
              <BookOpen className="text-blue-600 flex-shrink-0" size={24} />
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 truncate">
                <span className="hidden sm:inline">UniPrep Copilot</span>
                <span className="sm:hidden">UniPrep</span>
              </h1>
            </Link>
          </div>
          
          {/* Right side actions - Responsive */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0">
            {/* User Profile Link - Icon only on mobile */}
            <Link
              to="/profile"
              className="flex items-center gap-1.5 sm:gap-2 text-gray-700 hover:text-blue-600 transition-colors p-1.5 sm:p-2 rounded-md hover:bg-gray-50 active:bg-gray-100 touch-manipulation"
              title={user?.name || "User Profile"}
            >
              <User size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline text-sm sm:text-base font-medium truncate max-w-[120px] lg:max-w-none">
                {user?.name || "User"}
              </span>
            </Link>
            
            {/* Logout Button - Icon only on mobile */}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 sm:gap-2 text-gray-700 hover:text-red-600 transition-colors p-1.5 sm:p-2 rounded-md hover:bg-gray-50 active:bg-gray-100 touch-manipulation"
              title="Logout"
            >
              <LogOut size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline text-sm sm:text-base">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
