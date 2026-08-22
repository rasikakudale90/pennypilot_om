import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Hash, Plus, ArrowRight, TrendingUp } from 'lucide-react';
import { expenseApi } from '../api/expenseApi';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { LoadingSpinner, ErrorBanner } from '../components/common/States';
import { ExpenseTable } from '../components/expense/ExpenseTable';
import { ExpenseCard } from '../components/expense/ExpenseCard';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // Queries
  const { 
    data: summary, 
    isLoading: isSummaryLoading, 
    isError: isSummaryError,
    refetch: refetchSummary
  } = useQuery({
    queryKey: ['expenseSummary'],
    queryFn: () => expenseApi.getExpenseSummary(),
  });

  const { 
    data: expenses, 
    isLoading: isExpensesLoading, 
    isError: isExpensesError,
    refetch: refetchExpenses
  } = useQuery({
    queryKey: ['recentExpenses'],
    queryFn: () => expenseApi.getExpenses(),
    select: (data) => data.slice(0, 5), // Keep only top 5 recent expenses
  });

  const handleRetry = () => {
    refetchSummary();
    refetchExpenses();
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  if (isSummaryLoading || isExpensesLoading) {
    return <LoadingSpinner />;
  }

  if (isSummaryError || isExpensesError) {
    return <ErrorBanner onRetry={handleRetry} />;
  }

  const totalAmount = summary?.totalAmount ?? 0;
  const count = summary?.expenseCount ?? 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-tr from-brand-500/10 via-brand-500/5 to-transparent p-6 rounded-3xl border border-brand-500/10 dark:border-brand-500/5">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tight">Welcome to PennyPilot</h1>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Monitor and govern your daily cash outflow in style.</p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/expenses/add')}
          leftIcon={<Plus className="w-5 h-5" />}
        >
          Add Expense
        </Button>
      </div>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Total Spent */}
        <Card className="p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-300">
            <CreditCard className="w-32 h-32 text-brand-500" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-brand-500/10 dark:bg-brand-500/20 rounded-xl text-brand-600 dark:text-brand-400">
                <CreditCard className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Outflow</span>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-slate-50">
                {formatCurrency(totalAmount)}
              </span>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-500">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Computed in real time</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Card 2: Count */}
        <Card className="p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-300">
            <Hash className="w-32 h-32 text-brand-500" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-brand-500/10 dark:bg-brand-500/20 rounded-xl text-brand-600 dark:text-brand-400">
                <Hash className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Transactions Count</span>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-slate-50">
                {count}
              </span>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-2">Active expense entries</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Recent Transactions</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/expenses')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="font-bold"
          >
            View Ledger
          </Button>
        </div>

        {expenses && expenses.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <ExpenseTable
                expenses={expenses}
                onEdit={(id) => navigate(`/expenses/edit/${id}`)}
                onDelete={() => refetchExpenses()} // simply trigger query updates
              />
            </div>
            
            {/* Mobile Cards View */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
              {expenses.map((exp) => (
                <ExpenseCard
                  key={exp.id}
                  expense={exp}
                  onEdit={(id) => navigate(`/expenses/edit/${id}`)}
                  onDelete={() => refetchExpenses()}
                />
              ))}
            </div>
          </>
        ) : (
          <Card className="p-8 text-center text-slate-500 border border-dashed dark:border-slate-800">
            No expenses recorded yet. Start logging to view ledger updates!
          </Card>
        )}
      </div>
    </div>
  );
};
export default DashboardPage;
