import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 dark:bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Panel — slides up on mobile, fades in on desktop */}
      <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-xl animate-slide-up
        bg-white dark:bg-[#181b27]
        border border-slate-200 dark:border-white/10">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-white/8">
          <h3 className="text-base font-bold text-slate-800 dark:text-white">{title}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1.5 rounded-lg"
          >
            <X className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-5 text-slate-700 dark:text-slate-300">
          {children}
        </div>
      </div>
    </div>
  );
};
