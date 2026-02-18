import client from './client';
import { Transaction, TransactionFilters, PaginatedResponse } from '../types';

export async function getTransactions(filters?: TransactionFilters): Promise<PaginatedResponse<Transaction>> {
  const { data } = await client.get<PaginatedResponse<Transaction>>('/api/transactions', { params: filters });
  return data;
}

export async function createTransaction(payload: {
  account_id: string;
  category_id?: string;
  type: string;
  amount: number;
  description?: string;
  date: string;
}): Promise<Transaction> {
  const { data } = await client.post<Transaction>('/api/transactions', payload);
  return data;
}

export async function updateTransaction(id: string, payload: {
  account_id?: string;
  category_id?: string;
  type?: string;
  amount?: number;
  description?: string;
  date?: string;
}): Promise<Transaction> {
  const { data } = await client.put<Transaction>(`/api/transactions/${id}`, payload);
  return data;
}

export async function deleteTransaction(id: string): Promise<void> {
  await client.delete(`/api/transactions/${id}`);
}

export async function createTransfer(payload: {
  from_account_id: string;
  to_account_id: string;
  amount: number;
  description?: string;
  date: string;
}): Promise<{ outgoing: Transaction; incoming: Transaction }> {
  const { data } = await client.post('/api/transfers', payload);
  return data;
}
