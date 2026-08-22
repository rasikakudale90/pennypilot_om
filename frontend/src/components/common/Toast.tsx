import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
          error: <AlertCircle className="w-5 h-5 text-red-500" />,
          info: <Info className="w-5 h-5 text-blue-500" />,
        };

        const themeStyle = {
          success: 'bg-emerald-50/90 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-200',
          error: 'bg-red-50/90 dark:bg-red-950/30 border-red-100 dark:border-red-800/40 text-red-800 dark:text-red-200',
          info: 'bg-blue-50/90 dark:bg-blue-950/30 border-blue-100 dark:border-blue-800/40 text-blue-800 dark:text-blue-200',
        };

        return (
          <div
            key={toast.id}
            className={`flex items-center gap-3 p-4 rounded-2xl border backdrop-blur-md pointer-events-auto shadow-xl transition-all duration-300 animate-slide-up ${themeStyle[toast.type]}`}
          >
            <div className="flex-shrink-0">{icons[toast.type]}</div>
            <div className="flex-grow text-sm font-semibold">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 p-1 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800/60 opacity-80 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
