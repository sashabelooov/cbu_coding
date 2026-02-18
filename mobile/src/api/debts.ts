import client from './client';
import { Debt } from '../types';

export async function getDebts(type?: string, status?: string): Promise<Debt[]> {
  const params: Record<string, string> = {};
  if (type) params.type = type;
  if (status) params.status = status;
  const { data } = await client.get<Debt[]>('/api/debts', { params });
  return data;
}

export async function createDebt(payload: {
  type: string;
  person_name: string;
  amount: number;
  currency?: string;
  description?: string;
  due_date?: string;
}): Promise<Debt> {
  const { data } = await client.post<Debt>('/api/debts', payload);
  return data;
}

export async function updateDebt(id: string, payload: {
  person_name?: string;
  amount?: number;
  currency?: string;
  description?: string;
  due_date?: string;
}): Promise<Debt> {
  const { data } = await client.put<Debt>(`/api/debts/${id}`, payload);
  return data;
}

export async function closeDebt(id: string): Promise<Debt> {
  const { data } = await client.patch<Debt>(`/api/debts/${id}/close`);
  return data;
}
