import axiosClient from './axiosClient';
import { Expense, CreateExpenseRequest, UpdateExpenseRequest, ExpenseSummary, ExpenseFilters } from '../types/expense';

export const expenseApi = {
  getExpenses: async (filters?: ExpenseFilters): Promise<Expense[]> => {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.category) params.append('category', filters.category);
      if (filters.date) params.append('date', filters.date);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
    }
    const response = await axiosClient.get<Expense[]>('/expenses', { params });
    return response.data;
  },

  getExpenseById: async (id: number): Promise<Expense> => {
    const response = await axiosClient.get<Expense>(`/expenses/${id}`);
    return response.data;
  },

  createExpense: async (data: CreateExpenseRequest): Promise<Expense> => {
    const response = await axiosClient.post<Expense>('/expenses', data);
    return response.data;
  },

  updateExpense: async (id: number, data: UpdateExpenseRequest): Promise<Expense> => {
    const response = await axiosClient.put<Expense>(`/expenses/${id}`, data);
    return response.data;
  },

  deleteExpense: async (id: number): Promise<void> => {
    await axiosClient.delete(`/expenses/${id}`);
  },

  getExpenseSummary: async (filters?: ExpenseFilters): Promise<ExpenseSummary> => {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.category) params.append('category', filters.category);
      if (filters.date) params.append('date', filters.date);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
    }
    const response = await axiosClient.get<ExpenseSummary>('/expenses/summary', { params });
    return response.data;
  },
};
