import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Pencil } from 'lucide-react';
import { expenseApi } from '../api/expenseApi';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { LoadingSpinner, ErrorBanner } from '../components/common/States';
import { ExpenseForm } from '../components/expense/ExpenseForm';

export const EditExpensePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useApp();

  const expenseId = id ? parseInt(id, 10) : null;

  const { data: expense, isLoading, isError, refetch } = useQuery({
    queryKey: ['expenseDetails', expenseId],
    queryFn: () => {
      if (expenseId === null || isNaN(expenseId)) return Promise.reject(new Error('Invalid expense ID'));
      return expenseApi.getExpenseById(expenseId);
    },
    enabled: expenseId !== null && !isNaN(expenseId),
  });

  const mutation = useMutation({
    mutationFn: (data: any) => {
      if (expenseId === null) return Promise.reject(new Error('ID cannot be null'));
      return expenseApi.updateExpense(expenseId, data);
    },
    onSuccess: () => {
      showToast('Changes saved successfully.', 'success');
      queryClient.invalidateQueries({ queryKey: ['expensesList'] });
      queryClient.invalidateQueries({ queryKey: ['expenseSummary'] });
      queryClient.invalidateQueries({ queryKey: ['recentExpenses'] });
      queryClient.invalidateQueries({ queryKey: ['expenseDetails', expenseId] });
      navigate('/expenses');
    },
    onError: () => showToast('Failed to save changes. Please try again.', 'error'),
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError || !expense) return <ErrorBanner message="Could not locate that expense entry." onRetry={() => refetch()} />;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl"
        >
          <ArrowLeft className="w-5 h-5 text-slate-500 dark:text-slate-400" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Pencil className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            Edit Expense
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-xs sm:max-w-md">
            Updating: <span className="text-slate-800 dark:text-slate-200 font-semibold">{expense.title}</span>
          </p>
        </div>
      </div>

      {/* Form Card */}
      <Card glass="lg" className="p-5 sm:p-8">
        <ExpenseForm
          initialValues={{
            title: expense.title,
            amount: expense.amount,
            category: expense.category,
            expenseDate: expense.expenseDate,
            description: expense.description,
          }}
          onSubmit={(data) => mutation.mutate(data)}
          onCancel={() => navigate('/expenses')}
          isLoading={mutation.isPending}
        />
      </Card>
    </div>
  );
};
export default EditExpensePage;
