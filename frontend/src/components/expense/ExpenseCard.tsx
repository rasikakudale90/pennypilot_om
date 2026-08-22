import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Expense } from '../../types/expense';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { CATEGORY_COLORS } from './ExpenseTable';

interface ExpenseCardProps {
  expense: Expense;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, onEdit, onDelete }) => {
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
    <Card hoverable className="p-5 flex flex-col justify-between gap-4 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <span className={`px-2 py-0.5 text-[10px] font-bold rounded border uppercase inline-block ${CATEGORY_COLORS[expense.category]}`}>
            {expense.category}
          </span>
          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{expense.title}</h4>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 block">{formatDate(expense.expenseDate)}</span>
        </div>
        <div className="text-right">
          <span className="text-lg font-extrabold text-slate-950 dark:text-slate-50 block">
            {formatCurrency(expense.amount)}
          </span>
        </div>
      </div>

      {expense.description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 border-t border-slate-50 dark:border-slate-800/40 pt-3">
          {expense.description}
        </p>
      )}

      <div className="flex items-center justify-end gap-2 border-t border-slate-50 dark:border-slate-800/40 pt-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(expense.id)}
          className="p-2 rounded-xl text-slate-500 hover:text-brand-500 hover:bg-brand-50/20 border-slate-200 dark:border-slate-800"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(expense.id)}
          className="p-2 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-50/20 border-slate-200 dark:border-slate-800"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </Card>
  );
};
export default ExpenseCard;
