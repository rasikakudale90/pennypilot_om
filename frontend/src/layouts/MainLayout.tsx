import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Navbar } from '../components/layout/Navbar';
import { ToastContainer } from '../components/common/Toast';
import { useApp } from '../context/AppContext';

export const MainLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme } = useApp();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden relative bg-slate-50 dark:bg-[#0f1117] text-slate-800 dark:text-slate-100 transition-colors duration-300">

      {/* Dark mode: subtle animated blobs. Light mode: nothing extra. */}
      {theme === 'dark' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-56 -left-56 w-[560px] h-[560px] bg-violet-700/10 blur-[120px] animate-morph-slow" />
          <div className="absolute top-[40%] -right-56 w-[600px] h-[600px] bg-indigo-600/8 blur-[140px] animate-morph-medium" />
          <div className="absolute -bottom-56 left-[20%] w-[480px] h-[480px] bg-cyan-600/8 blur-[110px] animate-morph-fast" />
        </div>
      )}

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <Navbar onToggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

      <ToastContainer />
    </div>
  );
};
export default MainLayout;
