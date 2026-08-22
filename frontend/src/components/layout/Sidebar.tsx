import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Wallet, PlusCircle, X } from 'lucide-react';
import { Button } from '../common/Button';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const links = [
    { name: 'Dashboard', to: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Expenses', to: '/expenses', icon: <Wallet className="w-5 h-5" /> },
    { name: 'Add Expense', to: '/expenses/add', icon: <PlusCircle className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile Sidebar Overlay Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm lg:hidden transition-opacity duration-300 animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 glass-effect border-r border-slate-100 dark:border-slate-800/40 flex flex-col justify-between p-6 transition-transform duration-300 lg:translate-x-0 lg:static ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-8">
          {/* Header & Close Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-brand-500 rounded-xl text-white shadow-lg shadow-brand-500/20">
                <Wallet className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight bg-clip-text">
                Penny<span className="text-brand-500">Pilot</span>
              </h1>
            </div>
            
            {/* Mobile close button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden p-1 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-slate-100"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/15 dark:shadow-brand-500/10'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200'
                  }`
                }
              >
                {link.icon}
                <span>{link.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer info banner */}
        <div className="p-4 bg-slate-100/50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 text-center">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">System Version</span>
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-1 block">V1 - Core Tracker</span>
        </div>
      </aside>
    </>
  );
};
