import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught rendering error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-slate-50 dark:bg-[#0f1117] text-slate-800 dark:text-slate-100">
          <div className="max-w-lg w-full p-8 rounded-2xl bg-white dark:bg-[#181b27] border border-slate-200 dark:border-white/10 shadow-xl text-center space-y-5">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/15 flex items-center justify-center mx-auto text-red-500">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold">Something went wrong</h2>
              <div className="p-3 text-left bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/20 rounded-xl overflow-auto max-h-40">
                <p className="text-xs font-mono text-red-700 dark:text-red-300 break-words">
                  {this.state.error?.toString() || 'An unexpected error occurred while rendering the page.'}
                </p>
              </div>
            </div>
            <Button variant="primary" onClick={this.handleReload} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" /> Reload Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
