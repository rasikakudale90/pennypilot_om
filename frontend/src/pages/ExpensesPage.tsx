import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { expenseApi } from '../api/expenseApi';
import { ExpenseFilters as FilterType } from '../types/expense';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import { LoadingSpinner, EmptyState, ErrorBanner } from '../components/common/States';
import { ExpenseFilters } from '../components/expense/ExpenseFilters';
import { ExpenseCard } from '../components/expense/ExpenseCard';

export const ExpensesPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useApp();

  const [filters, setFilters] = useState<FilterType>({
    category: '',
    date: '',
    startDate: '',
    endDate: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState<number | null>(null);

  const { data: expenses, isLoading, isError, error: expensesError, refetch } = useQuery({
    queryKey: ['expensesList', filters],
    queryFn: () => expenseApi.getExpenses(filters),
  });

  const { data: summary } = useQuery({
    queryKey: ['expensesSummaryFiltered', filters],
    queryFn: () => expenseApi.getExpenseSummary(filters),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => expenseApi.deleteExpense(id),
    onSuccess: () => {
      showToast('Expense successfully deleted.', 'success');
      queryClient.invalidateQueries({ queryKey: ['expensesList'] });
      queryClient.invalidateQueries({ queryKey: ['expenseSummary'] });
      queryClient.invalidateQueries({ queryKey: ['recentExpenses'] });
      queryClient.invalidateQueries({ queryKey: ['expensesSummaryFiltered'] });
      setDeleteModalOpen(false);
    },
    onError: () => showToast('Failed to delete expense. Please try again.', 'error'),
  });

  const handleDeleteClick = (id: number) => {
    setSelectedExpenseId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedExpenseId !== null) deleteMutation.mutate(selectedExpenseId);
  };

  const formatCurrency = (val: number | string) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(Number(val) || 0);

  const filteredExpenses = expenses?.filter((exp) =>
    exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (exp.description && exp.description.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">All Expenses</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage, filter, and track all your logged spending.</p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/expenses/add')}
          leftIcon={<Plus className="w-4 h-4" />}
          className="w-full sm:w-auto"
        >
          Add Expense
        </Button>
      </div>

      {/* Aggregate Statistics Bar */}
      {summary && (
        <Card glass="sm" className="p-4 flex flex-col sm:flex-row items-center justify-around gap-4 text-center">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Filtered Total</span>
            <span className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mt-1 block">
              {formatCurrency(summary.totalAmount)}
            </span>
          </div>
          <div className="w-full sm:w-px h-px sm:h-8 bg-slate-200 dark:bg-white/10" />
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Entries</span>
            <span className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mt-1 block">
              {summary.expenseCount}
            </span>
          </div>
          <div className="w-full sm:w-px h-px sm:h-8 bg-slate-200 dark:bg-white/10" />
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Avg / Transaction</span>
            <span className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mt-1 block">
              {summary.expenseCount > 0
                ? formatCurrency(summary.totalAmount / summary.expenseCount)
                : '—'}
            </span>
          </div>
        </Card>
      )}

      {/* Filters Toolbar */}
      <ExpenseFilters filters={filters} onFilterChange={setFilters} />

      {/* Search Input Bar */}
      <div className="relative w-full max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by title or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="glass-input w-full pl-10"
        />
      </div>

      {/* Main List */}
      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <ErrorBanner
          message={(expensesError as any)?.message || 'Failed to load expenses list.'}
          onRetry={() => refetch()}
        />
      ) : filteredExpenses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExpenses.map((exp) => (
            <ExpenseCard
              key={exp.id}
              expense={exp}
              onEdit={(id) => navigate(`/expenses/edit/${id}`)}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title={searchQuery ? 'No Matching Expenses' : 'No Expenses Recorded'}
          description={
            searchQuery
              ? 'Try changing your search keywords or resetting your active filters.'
              : 'Start tracking your spending by adding your first expense.'
          }
          actionText={searchQuery ? 'Clear Search' : 'Add First Expense'}
          onAction={searchQuery ? () => setSearchQuery('') : () => navigate('/expenses/add')}
        />
      )}

      {/* Delete Modal */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Expense">
        <div className="space-y-5">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Are you sure you want to delete this expense? This action cannot be undone.
          </p>
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleteMutation.isPending}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              isLoading={deleteMutation.isPending}
              className="w-full sm:w-auto"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default ExpensesPage;
