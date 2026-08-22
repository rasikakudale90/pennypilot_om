export type ExpenseCategory = 'FOOD' | 'TRANSPORT' | 'SHOPPING' | 'BILLS' | 'HEALTH' | 'ENTERTAINMENT' | 'OTHER';

export interface Expense {
  id: number;
  title: string;
  amount: number;
  category: ExpenseCategory;
  expenseDate: string; // yyyy-MM-dd
  description?: string;
  createdAt: string; // OffsetDateTime ISO string
  updatedAt: string; // OffsetDateTime ISO string
}

export interface CreateExpenseRequest {
  title: string;
  amount: number;
  category: ExpenseCategory;
  expenseDate: string;
  description?: string;
}

export interface UpdateExpenseRequest {
  title: string;
  amount: number;
  category: ExpenseCategory;
  expenseDate: string;
  description?: string;
}

export interface ExpenseSummary {
  totalAmount: number;
  expenseCount: number;
}

export interface ExpenseFilters {
  category?: ExpenseCategory | '';
  date?: string;
  startDate?: string;
  endDate?: string;
}
