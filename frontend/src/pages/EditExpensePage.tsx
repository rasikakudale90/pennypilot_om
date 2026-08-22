import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expenseApi } from '../api/expenseApi';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { LoadingSpinner, ErrorBanner } from '../components/common/States';
import { ExpenseForm } from '../components/expense/ExpenseForm';

export const EditExpensePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useApp();
  
  const expenseId = id ? parseInt(id, 10) : null;

  // Query Details
  const { 
    data: expense, 
    isLoading, 
    isError, 
    refetch 
  } = useQuery({
    queryKey: ['expenseDetails', expenseId],
    queryFn: () => {
      if (expenseId === null || isNaN(expenseId)) {
        return Promise.reject(new Error('Invalid expense ID'));
      }
      return expenseApi.getExpenseById(expenseId);
    },
    enabled: expenseId !== null && !isNaN(expenseId),
  });

  // Mutation
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
    onError: () => {
      showToast('Failed to save changes. Please try again.', 'error');
    },
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !expense) {
    return <ErrorBanner message="Could not locate that expense entry." onRetry={() => refetch()} />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tight">Modify Expense</h1>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Update the fields of this logged transaction.</p>
      </div>

      <Card className="p-6 md:p-8 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 shadow-md">
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
