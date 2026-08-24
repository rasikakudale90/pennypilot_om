import React from 'react';
import { X, SlidersHorizontal, Calendar, Tag } from 'lucide-react';
import { ExpenseCategory, ExpenseFilters as FilterType } from '../../types/expense';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

interface ExpenseFiltersProps {
  filters: FilterType;
  onFilterChange: (filters: FilterType) => void;
}

const CATEGORIES: (ExpenseCategory | '')[] = [
  '',
  'FOOD',
  'TRANSPORT',
  'SHOPPING',
  'BILLS',
  'HEALTH',
  'ENTERTAINMENT',
  'OTHER',
];

export const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({ filters, onFilterChange }) => {
  const set = (patch: Partial<FilterType>) => onFilterChange({ ...filters, ...patch });

  const handleClearFilters = () =>
    onFilterChange({ category: '', date: '', startDate: '', endDate: '' });

  const hasActive = Boolean(filters.category || filters.date || filters.startDate || filters.endDate);

  return (
    <Card glass="sm" className="p-4 sm:p-5 space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
            Filter Ledger
          </span>
          {hasActive && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-brand-50 dark:bg-brand-500/15 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-500/30">
              Active
            </span>
          )}
        </div>

        {hasActive && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 px-2.5 py-1 rounded-lg gap-1"
          >
            <X className="w-3.5 h-3.5" /> Reset
          </Button>
        )}
      </div>

      {/* Inputs grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Category */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <Tag className="w-3 h-3 text-slate-400 dark:text-slate-500" /> Category
          </label>
          <select
            value={filters.category || ''}
            onChange={(e) => set({ category: e.target.value as ExpenseCategory | '' })}
            className="glass-input w-full cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === '' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Specific Date */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <Calendar className="w-3 h-3 text-slate-400 dark:text-slate-500" /> Exact Date
          </label>
          <input
            type="date"
            value={filters.date || ''}
            onChange={(e) => set({ startDate: '', endDate: '', date: e.target.value })}
            className="glass-input w-full"
          />
        </div>

        {/* From Date */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <Calendar className="w-3 h-3 text-slate-400 dark:text-slate-500" /> From
          </label>
          <input
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => set({ date: '', startDate: e.target.value })}
            className="glass-input w-full"
          />
        </div>

        {/* To Date */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <Calendar className="w-3 h-3 text-slate-400 dark:text-slate-500" /> To
          </label>
          <input
            type="date"
            value={filters.endDate || ''}
            onChange={(e) => set({ date: '', endDate: e.target.value })}
            className="glass-input w-full"
          />
        </div>
      </div>
    </Card>
  );
};
export default ExpenseFilters;
