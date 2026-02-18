import client from './client';
import { Category } from '../types';

export async function getCategories(type?: 'INCOME' | 'EXPENSE'): Promise<Category[]> {
  const params = type ? { type } : {};
  const { data } = await client.get<Category[]>('/api/categories', { params });
  return data;
}

export async function createCategory(payload: {
  name: string;
  type: 'INCOME' | 'EXPENSE';
  icon?: string;
  color?: string;
}): Promise<Category> {
  const { data } = await client.post<Category>('/api/categories', payload);
  return data;
}
