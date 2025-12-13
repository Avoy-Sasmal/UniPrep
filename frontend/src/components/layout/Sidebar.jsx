import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Palette, Users, Home, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useRef } from 'react';

const Sidebar = ({ onClose, isCollapsed, onToggleCollapse }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const firstLinkRef = useRef(null);

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/subjects', icon: BookOpen, label: 'Subjects' },
    { path: '/styles', icon: Palette, label: 'Answer Styles' },
    { path: '/community', icon: Users, label: 'Community' }
  ];

  // Close mobile sidebar on route change (but not on initial mount)
  const prevPathnameRef = useRef(location.pathname);
  useEffect(() => {
    if (onClose && prevPathnameRef.current !== location.pathname) {
      // Only close if pathname actually changed
      prevPathnameRef.current = location.pathname;
      const timer = setTimeout(() => {
        onClose();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      prevPathnameRef.current = location.pathname;
    }
  }, [location.pathname, onClose]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Close on Escape key
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
      
      // Focus management for keyboard navigation
      if (e.key === 'Tab' && sidebarRef.current) {
        const focusableElements = sidebarRef.current.querySelectorAll(
          'a, button, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Handle link click for mobile
  const handleLinkClick = (e) => {
    // Don't prevent default - let navigation happen
    if (onClose) {
      // Close sidebar after a small delay to allow navigation
      setTimeout(() => {
        onClose();
      }, 150);
    }
  };

  const getActiveState = (itemPath) => {
    if (itemPath === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(itemPath);
  };

  return (
    <aside
      ref={sidebarRef}
      className={`bg-white shadow-sm transition-all duration-300 ease-in-out ${
        isCollapsed 
          ? 'w-16' 
          : 'w-64'
      } ${
        onClose 
          ? 'h-full' 
          : 'sticky top-14 sm:top-16 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)]'
      } overflow-hidden flex flex-col`}
    >
      {/* Desktop Toggle Button */}
      {!onClose && (
        <div className="flex justify-end p-2 border-b">
          <button
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4">
        <ul className="space-y-1.5 sm:space-y-2">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = getActiveState(item.path);
            
            return (
              <li key={item.path}>
                <Link
                  ref={index === 0 ? firstLinkRef : null}
                  to={item.path}
                  onClick={(e) => handleLinkClick(e, item.path)}
                  className={`group flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-medium shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  } ${
                    isCollapsed ? 'justify-center' : ''
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon 
                    size={20} 
                    className={`flex-shrink-0 ${
                      isActive ? 'text-blue-600' : 'text-gray-600 group-hover:text-gray-900'
                    }`} 
                  />
                  {!isCollapsed && (
                    <span className="text-sm sm:text-base whitespace-nowrap truncate">
                      {item.label}
                    </span>
                  )}
                  {isActive && !isCollapsed && (
                    <span className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile close button and hint */}
      {onClose && (
        <>
          <div className="p-3 border-b flex items-center justify-between bg-white sticky top-0 z-10">
            <span className="text-sm font-semibold text-gray-800">Menu</span>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onClose) onClose();
              }}
              className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              aria-label="Close menu"
              type="button"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-4 border-t text-xs text-gray-500 text-center mt-auto">
            Tap outside to close
          </div>
        </>
      )}
    </aside>
  );
};

export default Sidebar;

