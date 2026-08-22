import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { expenseApi } from '../api/expenseApi';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { ExpenseForm } from '../components/expense/ExpenseForm';

export const AddExpensePage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useApp();

  const mutation = useMutation({
    mutationFn: (data: any) => expenseApi.createExpense(data),
    onSuccess: () => {
      showToast('Expense recorded successfully.', 'success');
      // Invalidate queries to trigger refresh
      queryClient.invalidateQueries({ queryKey: ['expensesList'] });
      queryClient.invalidateQueries({ queryKey: ['expenseSummary'] });
      queryClient.invalidateQueries({ queryKey: ['recentExpenses'] });
      navigate('/expenses');
    },
    onError: () => {
      showToast('Failed to record expense. Please try again.', 'error');
    },
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tight">Record Expense</h1>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Fill in the fields to log a new purchase or item.</p>
      </div>

      <Card className="p-6 md:p-8 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 shadow-md">
        <ExpenseForm
          onSubmit={(data) => mutation.mutate(data)}
          onCancel={() => navigate('/expenses')}
          isLoading={mutation.isPending}
        />
      </Card>
    </div>
  );
};
export default AddExpensePage;
