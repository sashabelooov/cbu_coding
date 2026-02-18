import client from './client';
import { Budget, BudgetComparison } from '../types';

export async function getBudgets(month: number, year: number): Promise<Budget[]> {
  const { data } = await client.get<Budget[]>('/api/budgets', { params: { month, year } });
  return data;
}

export async function createBudget(payload: {
  category_id?: string;
  type: string;
  month: number;
  year: number;
  planned_amount: number;
}): Promise<Budget> {
  const { data } = await client.post<Budget>('/api/budgets', payload);
  return data;
}

export async function updateBudget(id: string, payload: { planned_amount: number }): Promise<Budget> {
  const { data } = await client.put<Budget>(`/api/budgets/${id}`, payload);
  return data;
}

export async function deleteBudget(id: string): Promise<void> {
  await client.delete(`/api/budgets/${id}`);
}

export async function getBudgetComparison(month: number, year: number): Promise<BudgetComparison[]> {
  const { data } = await client.get<BudgetComparison[]>('/api/budgets/comparison', { params: { month, year } });
  return data;
}
