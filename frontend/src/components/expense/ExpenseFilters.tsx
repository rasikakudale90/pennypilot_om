import React from 'react';
import { X, Calendar } from 'lucide-react';
import { ExpenseCategory, ExpenseFilters as FilterType } from '../../types/expense';
import { Button } from '../common/Button';

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
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      category: e.target.value as ExpenseCategory | '',
    });
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      date: '', // Clear single date when date range is chosen
      startDate: e.target.value,
    });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      date: '',
      endDate: e.target.value,
    });
  };

  const handleSingleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      startDate: '', // Clear date range when single date is chosen
      endDate: '',
      date: e.target.value,
    });
  };

  const handleClearFilters = () => {
    onFilterChange({
      category: '',
      date: '',
      startDate: '',
      endDate: '',
    });
  };

  const hasActiveFilters = 
    filters.category || 
    filters.date || 
    filters.startDate || 
    filters.endDate;

  return (
    <div className="glass-effect p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 flex flex-wrap items-end gap-5">
      {/* Category Filter */}
      <div className="flex-1 min-w-[200px] space-y-2">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">Category</label>
        <select
          value={filters.category || ''}
          onChange={handleCategoryChange}
          className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 border-0 focus-ring"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat === '' ? 'All Categories' : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Single Date Filter */}
      <div className="flex-1 min-w-[160px] space-y-2">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">Specific Date</label>
        <div className="relative">
          <input
            type="date"
            value={filters.date || ''}
            onChange={handleSingleDateChange}
            className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 border-0 focus-ring"
          />
        </div>
      </div>

      {/* Date Range Filters */}
      <div className="flex-1 min-w-[320px] space-y-2">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">Date Range</label>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={filters.startDate || ''}
            onChange={handleStartDateChange}
            placeholder="Start date"
            className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 border-0 focus-ring"
          />
          <span className="text-slate-400 text-xs font-bold uppercase px-1">to</span>
          <input
            type="date"
            value={filters.endDate || ''}
            onChange={handleEndDateChange}
            placeholder="End date"
            className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 border-0 focus-ring"
          />
        </div>
      </div>

      {/* Clear Action */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={handleClearFilters}
          className="border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex-shrink-0"
          leftIcon={<X className="w-4 h-4" />}
        >
          Reset Filters
        </Button>
      )}
    </div>
  );
};
