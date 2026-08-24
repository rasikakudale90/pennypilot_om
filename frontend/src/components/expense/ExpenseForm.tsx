import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ExpenseCategory } from '../../types/expense';
import { Button } from '../common/Button';

const expenseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  amount: z.coerce.number({ invalid_type_error: 'Must be a valid number' }).positive('Must be greater than zero'),
  category: z.enum(['FOOD', 'TRANSPORT', 'SHOPPING', 'BILLS', 'HEALTH', 'ENTERTAINMENT', 'OTHER'], {
    errorMap: () => ({ message: 'Select a valid category' }),
  }),
  expenseDate: z.string().min(1, 'Date is required'),
  description: z.string().optional(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface ExpenseFormProps {
  initialValues?: {
    title: string; amount: number; category: ExpenseCategory;
    expenseDate: string; description?: string;
  };
  onSubmit: (data: ExpenseFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
    {children}
  </label>
);

const FieldError: React.FC<{ message?: string }> = ({ message }) =>
  message ? <p className="text-xs text-red-500 mt-1">{message}</p> : null;

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  initialValues, onSubmit, onCancel, isLoading = false,
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: initialValues || {
      title: '', amount: undefined, category: 'FOOD',
      expenseDate: new Date().toISOString().split('T')[0], description: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      {/* Title */}
      <div>
        <Label>Title</Label>
        <input
          type="text"
          placeholder="e.g. Zomato Order, Petrol, Netflix..."
          {...register('title')}
          className="glass-input w-full"
        />
        <FieldError message={errors.title?.message} />
      </div>

      {/* Amount + Category + Date */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label>Amount (₹)</Label>
          <input
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register('amount')}
            className="glass-input w-full"
          />
          <FieldError message={errors.amount?.message} />
        </div>

        <div>
          <Label>Category</Label>
          <select {...register('category')} className="glass-input w-full">
            {['FOOD', 'TRANSPORT', 'SHOPPING', 'BILLS', 'HEALTH', 'ENTERTAINMENT', 'OTHER'].map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <FieldError message={errors.category?.message} />
        </div>

        <div>
          <Label>Date</Label>
          <input
            type="date"
            {...register('expenseDate')}
            className="glass-input w-full"
          />
          <FieldError message={errors.expenseDate?.message} />
        </div>
      </div>

      {/* Description */}
      <div>
        <Label>Notes <span className="normal-case font-normal text-slate-400">(optional)</span></Label>
        <textarea
          rows={3}
          placeholder="Any extra details..."
          {...register('description')}
          className="glass-input w-full resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
        <Button variant="ghost" type="button" onClick={onCancel} disabled={isLoading} className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button variant="primary" type="submit" isLoading={isLoading} className="w-full sm:w-auto">
          {initialValues ? 'Save Changes' : 'Record Expense'}
        </Button>
      </div>
    </form>
  );
};
export default ExpenseForm;
