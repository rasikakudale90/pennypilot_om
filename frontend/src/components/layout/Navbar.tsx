import React from 'react';
import { useLocation } from 'react-router-dom';
import { Sun, Moon, Menu } from 'lucide-react';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useApp();
  const isDark = theme === 'dark';

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return 'Dashboard';
    if (path === '/expenses') return 'Expenses';
    if (path === '/expenses/add') return 'Add Expense';
    if (path.startsWith('/expenses/edit')) return 'Edit Expense';
    return 'Not Found';
  };

  return (
    <header className={`sticky top-0 z-40 w-full px-6 py-4 flex items-center justify-between border-b transition-colors duration-300 ${
      isDark
        ? 'bg-[#13151f]/80 backdrop-blur-xl border-white/8 text-slate-100'
        : 'bg-white/90 backdrop-blur-xl border-slate-200 text-slate-800'
    }`}>
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className={`lg:hidden p-2 rounded-lg ${isDark ? 'text-slate-400 hover:bg-white/8' : 'text-slate-500 hover:bg-slate-100'}`}
        >
          <Menu className="w-5 h-5" />
        </Button>
        <h2 className="text-base font-bold tracking-tight">
          {getPageTitle()}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        {/* Clean Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border ${
            isDark
              ? 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200'
              : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
          }`}
        >
          {isDark ? (
            <><Sun className="w-3.5 h-3.5" /> Light</>
          ) : (
            <><Moon className="w-3.5 h-3.5" /> Dark</>
          )}
        </button>

        {/* User Badge */}
        <div className={`flex items-center gap-2 pl-3 border-l ${isDark ? 'border-white/8' : 'border-slate-200'}`}>
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center font-bold text-white text-sm">
            P
          </div>
          <span className={`hidden sm:inline text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Penny Pilot
          </span>
        </div>
      </div>
    </header>
  );
};
