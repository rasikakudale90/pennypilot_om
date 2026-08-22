import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4 max-w-md mx-auto gap-6 animate-fade-in">
      <div className="p-5 bg-brand-500/10 dark:bg-brand-500/20 text-brand-500 rounded-full animate-bounce">
        <Compass className="w-16 h-16" />
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-slate-900 dark:text-slate-50 tracking-tight">404</h1>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Lost in Transit</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          The page you are looking for does not exist or has been relocated to another route.
        </p>
      </div>
      <Button onClick={() => navigate('/dashboard')} variant="primary" size="md" className="px-6">
        Navigate to Dashboard
      </Button>
    </div>
  );
};
export default NotFoundPage;
