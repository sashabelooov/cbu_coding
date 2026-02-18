import client from './client';
import { Account } from '../types';

export async function getAccounts(): Promise<Account[]> {
  const { data } = await client.get<Account[]>('/api/accounts');
  return data;
}

export async function createAccount(payload: {
  name: string;
  type: string;
  currency?: string;
  balance?: number;
  color?: string;
  icon?: string;
}): Promise<Account> {
  const { data } = await client.post<Account>('/api/accounts', payload);
  return data;
}

export async function updateAccount(id: string, payload: {
  name?: string;
  type?: string;
  currency?: string;
  color?: string;
  icon?: string;
}): Promise<Account> {
  const { data } = await client.put<Account>(`/api/accounts/${id}`, payload);
  return data;
}

export async function deleteAccount(id: string): Promise<void> {
  await client.delete(`/api/accounts/${id}`);
}
