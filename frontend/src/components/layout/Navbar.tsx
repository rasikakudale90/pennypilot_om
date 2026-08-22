import React from 'react';
import { useLocation } from 'react-router-dom';
import { Sun, Moon, Menu } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { theme, toggleTheme } = useApp();
  const location = useLocation();

  // Helper to translate route paths to readable titles
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return 'Financial Overview';
    if (path === '/expenses') return 'Expense Ledger';
    if (path === '/expenses/add') return 'New Expense';
    if (path.startsWith('/expenses/edit')) return 'Modify Expense';
    return 'Not Found';
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-effect border-b border-slate-100 dark:border-slate-800/40 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 rounded-xl border border-slate-200 dark:border-slate-800"
        >
          <Menu className="w-5 h-5 text-slate-700 dark:text-slate-300" />
        </Button>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
          {getPageTitle()}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="p-2 rounded-full border border-slate-200/50 dark:border-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
        
        {/* User Badge stub */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-md">
            P
          </div>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">V1 User</span>
        </div>
      </div>
    </header>
  );
};
