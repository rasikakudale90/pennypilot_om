import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Wallet, PlusCircle, X } from 'lucide-react';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { theme } = useApp();

  const links = [
    { name: 'Dashboard', to: '/dashboard', icon: <LayoutDashboard className="w-4.5 h-4.5" /> },
    { name: 'Expenses', to: '/expenses', icon: <Wallet className="w-4.5 h-4.5" /> },
    { name: 'Add Expense', to: '/expenses/add', icon: <PlusCircle className="w-4.5 h-4.5" /> },
  ];

  const isDark = theme === 'dark';

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden transition-opacity duration-300 animate-fade-in"
          style={{ background: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(15,17,23,0.3)' }}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 flex flex-col justify-between p-5 transition-transform duration-300 lg:translate-x-0 lg:static ${isOpen ? 'translate-x-0' : '-translate-x-full'} ${
          isDark
            ? 'bg-[#13151f] border-r border-white/8 text-slate-100'
            : 'bg-white border-r border-slate-200 text-slate-800'
        }`}
      >
        <div className="space-y-7">
          {/* Logo */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl ${isDark ? 'bg-violet-600/20' : 'bg-violet-50'}`}>
                <Wallet className={`w-5 h-5 ${isDark ? 'text-violet-400' : 'text-violet-600'}`} />
              </div>
              <h1 className="text-lg font-bold tracking-tight">
                Penny<span className={isDark ? 'text-violet-400' : 'text-violet-600'}>Pilot</span>
              </h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className={`lg:hidden p-1.5 rounded-lg ${isDark ? 'hover:bg-white/8 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col gap-1">
            <p className={`text-[10px] font-bold uppercase tracking-[0.12em] mb-2 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
              Navigation
            </p>
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? isDark
                        ? 'bg-violet-600/15 text-violet-300 border border-violet-500/20'
                        : 'bg-violet-50 text-violet-700 border border-violet-100'
                      : isDark
                        ? 'text-slate-400 hover:bg-white/5 hover:text-slate-100 border border-transparent'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 border border-transparent'
                  }`
                }
              >
                {link.icon}
                <span>{link.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className={`text-center py-3 border-t ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
          <p className={`text-xs font-semibold ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
            Penny Pilot · v1.0
          </p>
        </div>
      </aside>
    </>
  );
};
