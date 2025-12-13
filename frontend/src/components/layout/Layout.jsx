import { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);
  const sidebarRef = useRef(null);

  // Close mobile sidebar on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && mobileSidebarOpen) {
        setMobileSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileSidebarOpen]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileSidebarOpen]);


  // Close mobile sidebar function
  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  // Toggle desktop sidebar
  const toggleDesktopSidebar = () => {
    setDesktopSidebarCollapsed((prev) => !prev);
  };

  // Handle window resize - close mobile sidebar if window becomes desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileSidebarOpen) {
        setMobileSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileSidebarOpen]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onToggleSidebar={() => setMobileSidebarOpen((prev) => !prev)} 
        sidebarOpen={mobileSidebarOpen}
      />
      <div className="flex relative">
        {/* Desktop Sidebar */}
        <div className="hidden md:block transition-all duration-300 ease-in-out">
          <Sidebar 
            isCollapsed={desktopSidebarCollapsed}
            onToggleCollapse={toggleDesktopSidebar}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => {
                setMobileSidebarOpen(false);
              }}
              aria-hidden="true"
            />
            
            {/* Sidebar Panel */}
            <div 
              className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-2xl z-50 md:hidden"
              ref={sidebarRef}
              style={{ transform: 'translateX(0)' }}
            >
              <Sidebar onClose={closeMobileSidebar} />
            </div>
          </>
        )}

        {/* Main Content */}
        <main 
          className={`flex-1 transition-all duration-300 ease-in-out ${
            desktopSidebarCollapsed ? 'md:ml-0' : 'md:ml-0'
          } p-2 sm:p-4 lg:p-6 w-full min-w-0 overflow-x-hidden`}
        >
          <div className="max-w-7xl mx-auto w-full min-h-[calc(100vh-200px)]">
            {children || <Outlet />}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
