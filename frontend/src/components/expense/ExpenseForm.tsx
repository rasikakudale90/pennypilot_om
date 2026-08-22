import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ExpenseCategory } from '../../types/expense';
import { Button } from '../common/Button';

// Validation Schema
const expenseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title cannot exceed 255 characters'),
  amount: z.coerce.number({ invalid_type_error: 'Amount must be a valid number' })
    .positive('Amount must be greater than zero'),
  category: z.enum(['FOOD', 'TRANSPORT', 'SHOPPING', 'BILLS', 'HEALTH', 'ENTERTAINMENT', 'OTHER'], {
    errorMap: () => ({ message: 'Please select a valid category' }),
  }),
  expenseDate: z.string().min(1, 'Expense date is required'),
  description: z.string().optional(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface ExpenseFormProps {
  initialValues?: {
    title: string;
    amount: number;
    category: ExpenseCategory;
    expenseDate: string;
    description?: string;
  };
  onSubmit: (data: ExpenseFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: initialValues || {
      title: '',
      amount: undefined,
      category: 'FOOD',
      expenseDate: new Date().toISOString().split('T')[0], // Default today
      description: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">Title</label>
        <input
          type="text"
          placeholder="e.g. Grocery Shopping"
          {...register('title')}
          className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 border-0 focus-ring"
        />
        {errors.title && (
          <p className="text-xs font-bold text-red-500">{errors.title.message}</p>
        )}
      </div>

      {/* Grid of Amount, Category, Date */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Amount */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">Amount</label>
          <input
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register('amount')}
            className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 border-0 focus-ring"
          />
          {errors.amount && (
            <p className="text-xs font-bold text-red-500">{errors.amount.message}</p>
          )}
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">Category</label>
          <select
            {...register('category')}
            className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 border-0 focus-ring"
          >
            <option value="FOOD">FOOD</option>
            <option value="TRANSPORT">TRANSPORT</option>
            <option value="SHOPPING">SHOPPING</option>
            <option value="BILLS">BILLS</option>
            <option value="HEALTH">HEALTH</option>
            <option value="ENTERTAINMENT">ENTERTAINMENT</option>
            <option value="OTHER">OTHER</option>
          </select>
          {errors.category && (
            <p className="text-xs font-bold text-red-500">{errors.category.message}</p>
          )}
        </div>

        {/* Expense Date */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">Date</label>
          <input
            type="date"
            {...register('expenseDate')}
            className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 border-0 focus-ring"
          />
          {errors.expenseDate && (
            <p className="text-xs font-bold text-red-500">{errors.expenseDate.message}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">Description</label>
        <textarea
          rows={3}
          placeholder="Optional notes or details..."
          {...register('description')}
          className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 border-0 focus-ring"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 border-t border-slate-100 dark:border-slate-800/60 pt-6">
        <Button variant="ghost" type="button" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" isLoading={isLoading}>
          {initialValues ? 'Save Changes' : 'Record Expense'}
        </Button>
      </div>
    </form>
  );
};
export default ExpenseForm;
