import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { expenseApi } from '../api/expenseApi';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { ExpenseForm } from '../components/expense/ExpenseForm';

export const AddExpensePage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useApp();

  const mutation = useMutation({
    mutationFn: (data: any) => expenseApi.createExpense(data),
    onSuccess: () => {
      showToast('Expense recorded successfully.', 'success');
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
            <PlusCircle className="w-6 h-6 sm:w-7 sm:h-7 text-brand-600 dark:text-brand-400" />
            Record Expense
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">Log a new purchase or outgoing payment.</p>
        </div>
      </div>

      {/* Form Card */}
      <Card glass="lg" className="p-5 sm:p-8">
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
