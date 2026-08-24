import React from 'react';
import { RefreshCw, FileQuestion, AlertOctagon } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';

// Loading Spinner / Skeleton
export const LoadingSpinner: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in w-full">
      <Card glass="lg" className="p-8 flex flex-col items-center justify-center gap-4 h-44">
        <div className="shimmer-glass w-10 h-10 rounded-full" />
        <div className="shimmer-glass w-48 h-7 rounded-xl" />
        <div className="shimmer-glass w-24 h-4 rounded-lg" />
      </Card>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2].map((n) => (
          <Card key={n} glass="md" className="p-6 space-y-3 h-28">
            <div className="shimmer-glass w-1/3 h-4 rounded-lg" />
            <div className="shimmer-glass w-2/3 h-7 rounded-xl" />
          </Card>
        ))}
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((n) => (
          <Card key={n} glass="sm" className="p-4 flex items-center gap-4">
            <div className="shimmer-glass w-9 h-9 rounded-xl flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="shimmer-glass w-1/4 h-3.5 rounded" />
              <div className="shimmer-glass w-1/2 h-3 rounded" />
            </div>
            <div className="shimmer-glass w-14 h-5 rounded-lg" />
          </Card>
        ))}
      </div>
    </div>
  );
};

// Empty State
interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Expenses Found',
  description = 'Get started by recording your first expense.',
  actionText,
  onAction,
}) => {
  return (
    <Card
      glass="md"
      className="flex flex-col items-center justify-center text-center py-14 px-6 max-w-md mx-auto gap-5 animate-fade-in border border-slate-200 dark:border-white/8"
    >
      <div className="p-4 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10">
        <FileQuestion className="w-10 h-10 text-slate-400 dark:text-slate-500" />
      </div>
      <div className="space-y-1.5">
        <h4 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h4>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
      </div>
      {actionText && onAction && (
        <Button onClick={onAction} variant="primary" size="sm">
          {actionText}
        </Button>
      )}
    </Card>
  );
};

// Error Banner
interface ErrorBannerProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  message = 'Failed to communicate with the server. Please check your connection.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-2xl bg-red-50 dark:bg-red-500/8 border border-red-200 dark:border-red-500/20 max-w-2xl mx-auto my-4 animate-fade-in">
      <div className="flex-shrink-0 p-2.5 bg-red-100 dark:bg-red-500/15 rounded-xl">
        <AlertOctagon className="w-5 h-5 text-red-500" />
      </div>
      <div className="flex-grow">
        <h5 className="font-bold text-sm text-red-700 dark:text-red-400">Something went wrong</h5>
        <p className="text-xs text-red-600 dark:text-red-400/70 mt-0.5 leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="flex-shrink-0 border-red-300 dark:border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Retry
        </Button>
      )}
    </div>
  );
};
