import React from 'react';
import { RefreshCw, FileQuestion, AlertOctagon } from 'lucide-react';
import { Button } from './Button';

// Loading Spinner Component
export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="relative flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
        <RefreshCw className="w-5 h-5 absolute text-brand-500 animate-pulse" />
      </div>
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Loading data...</p>
    </div>
  );
};

// Empty State Component
interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No Expenses Found",
  description = "Get started by recording your first personal expense.",
  actionText,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 max-w-sm mx-auto gap-4 animate-fade-in">
      <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
        <FileQuestion className="w-10 h-10 text-slate-400 dark:text-slate-500" />
      </div>
      <div className="space-y-1">
        <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">{title}</h4>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
      </div>
      {actionText && onAction && (
        <Button onClick={onAction} size="sm">
          {actionText}
        </Button>
      )}
    </div>
  );
};

// Error Banner Component
interface ErrorBannerProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  message = "Failed to communicate with the server. Please check your connection.",
  onRetry
}) => {
  return (
    <div className="flex items-center gap-4 p-5 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 text-red-800 dark:text-red-300 max-w-2xl mx-auto my-4 animate-fade-in shadow-sm">
      <div className="flex-shrink-0 p-2 bg-red-100 dark:bg-red-900/40 rounded-xl">
        <AlertOctagon className="w-6 h-6 text-red-600 dark:text-red-400" />
      </div>
      <div className="flex-grow">
        <h5 className="font-bold text-sm">Server Connection Error</h5>
        <p className="text-xs opacity-90 mt-0.5">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="border-red-200 hover:bg-red-100/50 text-red-800 dark:text-red-300 dark:border-red-900/60 dark:hover:bg-red-950/50 flex-shrink-0">
          Retry
        </Button>
      )}
    </div>
  );
};
