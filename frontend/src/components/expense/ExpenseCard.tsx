import React from 'react';
import { Edit2, Trash2, ShoppingBag, Utensils, Car, Zap, Heart, Film, CircleEllipsis } from 'lucide-react';
import { Expense } from '../../types/expense';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

interface ExpenseCardProps {
  expense: Expense;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  FOOD: <Utensils className="w-4 h-4" />,
  TRANSPORT: <Car className="w-4 h-4" />,
  SHOPPING: <ShoppingBag className="w-4 h-4" />,
  BILLS: <Zap className="w-4 h-4" />,
  HEALTH: <Heart className="w-4 h-4" />,
  ENTERTAINMENT: <Film className="w-4 h-4" />,
  OTHER: <CircleEllipsis className="w-4 h-4" />,
};

// Tailwind-safe classes (light + dark variants)
const CATEGORY_STYLES: Record<string, string> = {
  FOOD:          'text-lime-700 dark:text-lime-400 bg-lime-50 dark:bg-lime-500/10 border-lime-200 dark:border-lime-500/20',
  TRANSPORT:     'text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/20',
  SHOPPING:      'text-pink-700 dark:text-pink-400 bg-pink-50 dark:bg-pink-500/10 border-pink-200 dark:border-pink-500/20',
  BILLS:         'text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/20',
  HEALTH:        'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20',
  ENTERTAINMENT: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20',
  OTHER:         'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-500/10 border-slate-200 dark:border-slate-500/20',
};

export const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, onEdit, onDelete }) => {
  const formatCurrency = (val: number | string) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(Number(val) || 0);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const catStyle = CATEGORY_STYLES[expense.category] || CATEGORY_STYLES.OTHER;

  return (
    <Card hoverable glass="md" className="p-4 flex flex-col gap-3 group animate-fade-in">
      {/* Top row: icon + info + amount */}
      <div className="flex items-start gap-3">
        {/* Category icon */}
        <div className={`p-2 rounded-xl border flex-shrink-0 ${catStyle}`}>
          {CATEGORY_ICONS[expense.category] || CATEGORY_ICONS.OTHER}
        </div>

        {/* Title + date */}
        <div className="flex-1 min-w-0 space-y-0.5">
          <span className={`text-[10px] font-bold rounded border px-1.5 py-0.5 uppercase inline-block tracking-wide ${catStyle}`}>
            {expense.category}
          </span>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate leading-tight">{expense.title}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">{formatDate(expense.expenseDate)}</p>
        </div>

        {/* Amount */}
        <span className="text-base font-bold text-red-500 dark:text-accent-coral flex-shrink-0">
          {formatCurrency(expense.amount)}
        </span>
      </div>

      {/* Description */}
      {expense.description && (
        <p className="text-xs text-slate-500 dark:text-slate-500 border-t border-slate-100 dark:border-white/5 pt-2.5 leading-relaxed line-clamp-2">
          {expense.description}
        </p>
      )}

      {/* Action row — visible on hover (desktop) or always on touch */}
      <div className="flex items-center justify-end gap-1 border-t border-slate-100 dark:border-white/5 pt-2.5
        opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(expense.id)}
          className="px-2 py-1.5 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-lg"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(expense.id)}
          className="px-2 py-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </Card>
  );
};
export default ExpenseCard;
