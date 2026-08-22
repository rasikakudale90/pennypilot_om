import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, HelpCircle } from 'lucide-react';
import { expenseApi } from '../api/expenseApi';
import { ExpenseFilters as FilterType, ExpenseCategory } from '../types/expense';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import { LoadingSpinner, EmptyState, ErrorBanner } from '../components/common/States';
import { ExpenseFilters } from '../components/expense/ExpenseFilters';
import { ExpenseTable } from '../components/expense/ExpenseTable';
import { ExpenseCard } from '../components/expense/ExpenseCard';

export const ExpensesPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useApp();

  // Filter States
  const [filters, setFilters] = useState<FilterType>({
    category: '',
    date: '',
    startDate: '',
    endDate: '',
  });

  // Client Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Delete Modal States
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState<number | null>(null);

  // Queries
  const { 
    data: expenses, 
    isLoading, 
    isError, 
    refetch 
  } = useQuery({
    queryKey: ['expensesList', filters],
    queryFn: () => expenseApi.getExpenses(filters),
  });

  const { 
    data: summary,
    refetch: refetchSummary
  } = useQuery({
    queryKey: ['expensesSummaryFiltered', filters],
    queryFn: () => expenseApi.getExpenseSummary(filters),
  });

  // Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => expenseApi.deleteExpense(id),
    onSuccess: () => {
      showToast('Expense successfully deleted.', 'success');
      // Invalidate queries to trigger refresh
      queryClient.invalidateQueries({ queryKey: ['expensesList'] });
      queryClient.invalidateQueries({ queryKey: ['expenseSummary'] });
      queryClient.invalidateQueries({ queryKey: ['recentExpenses'] });
      queryClient.invalidateQueries({ queryKey: ['expensesSummaryFiltered'] });
      setDeleteModalOpen(false);
    },
    onError: () => {
      showToast('Failed to delete expense. Please try again.', 'error');
    },
  });

  const handleDeleteClick = (id: number) => {
    setSelectedExpenseId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedExpenseId !== null) {
      deleteMutation.mutate(selectedExpenseId);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val);
  };

  // Client side search filter logic
  const filteredExpenses = expenses?.filter((exp) =>
    exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (exp.description && exp.description.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header and Quick stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tight">Ledger Operations</h1>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">View, filter, edit, and audit your logged transactions.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="primary"
            onClick={() => navigate('/expenses/add')}
            leftIcon={<Plus className="w-5 h-5" />}
          >
            Add Expense
          </Button>
        </div>
      </div>

      {/* Aggregate Header statistics */}
      {summary && (
        <Card className="p-4 bg-brand-500/5 dark:bg-brand-500/10 border-brand-500/10 dark:border-brand-500/5 flex flex-wrap items-center justify-around gap-4 text-center">
          <div>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Filtered Outflow</span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mt-1 block">
              {formatCurrency(summary.totalAmount)}
            </span>
          </div>
          <div className="w-[1px] h-8 bg-slate-200 dark:bg-slate-800 hidden sm:block" />
          <div>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Record Count</span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mt-1 block">
              {summary.expenseCount} entries
            </span>
          </div>
        </Card>
      )}

      {/* Filters Toolbar */}
      <ExpenseFilters filters={filters} onFilterChange={setFilters} />

      {/* Search Input bar */}
      <div className="relative max-w-md">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search ledger by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl pl-12 pr-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 focus-ring"
        />
      </div>

      {/* Main ledger list body */}
      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <ErrorBanner onRetry={() => refetch()} />
      ) : filteredExpenses.length > 0 ? (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block">
            <ExpenseTable
              expenses={filteredExpenses}
              onEdit={(id) => navigate(`/expenses/edit/${id}`)}
              onDelete={handleDeleteClick}
            />
          </div>

          {/* Mobile Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
            {filteredExpenses.map((exp) => (
              <ExpenseCard
                key={exp.id}
                expense={exp}
                onEdit={(id) => navigate(`/expenses/edit/${id}`)}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          title={searchQuery ? "No Matches Found" : "Ledger is Empty"}
          description={searchQuery ? "Try refining your search text or removing date filters." : "Start recording your items to initialize the layout."}
          actionText={searchQuery ? "Reset Search" : "Record First Expense"}
          onAction={searchQuery ? () => setSearchQuery('') : () => navigate('/expenses/add')}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Expense"
      >
        <div className="space-y-6">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
            Are you sure you want to permanently delete this expense? This action cannot be undone.
          </p>
          <div className="flex items-center justify-end gap-3">
            <Button variant="ghost" onClick={() => setDeleteModalOpen(false)} disabled={deleteMutation.isPending}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete} isLoading={deleteMutation.isPending}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default ExpensesPage;
