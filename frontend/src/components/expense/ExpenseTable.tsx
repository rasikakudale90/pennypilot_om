import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Expense, ExpenseCategory } from '../../types/expense';
import { Button } from '../common/Button';

interface ExpenseTableProps {
  expenses: Expense[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  FOOD: 'bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-950/20 dark:text-orange-300 dark:border-orange-900/30',
  TRANSPORT: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:text-blue-300 dark:border-blue-900/30',
  SHOPPING: 'bg-pink-50 text-pink-700 border-pink-100 dark:bg-pink-950/20 dark:text-pink-300 dark:border-pink-900/30',
  BILLS: 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950/20 dark:text-purple-300 dark:border-purple-900/30',
  HEALTH: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-900/30',
  ENTERTAINMENT: 'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/20 dark:text-indigo-300 dark:border-indigo-900/30',
  OTHER: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/40 dark:text-slate-300 dark:border-slate-700/40',
};

export const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses, onEdit, onDelete }) => {
  
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200/40 dark:border-slate-800/40 bg-white dark:bg-slate-900 shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/40">
            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Title</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Description</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Amount</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {expenses.map((expense) => (
            <tr 
              key={expense.id}
              className="hover:bg-slate-50/40 dark:hover:bg-slate-900/30 transition-colors"
            >
              <td className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                {formatDate(expense.expenseDate)}
              </td>
              <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-slate-100">
                {expense.title}
              </td>
              <td className="px-6 py-4 text-sm">
                <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${CATEGORY_COLORS[expense.category]}`}>
                  {expense.category}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                {expense.description || '—'}
              </td>
              <td className="px-6 py-4 text-sm font-extrabold text-slate-900 dark:text-slate-100 text-right">
                {formatCurrency(expense.amount)}
              </td>
              <td className="px-6 py-4 text-sm text-center">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(expense.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-brand-500 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/20"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(expense.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-550 dark:hover:bg-red-950/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default ExpenseTable;
