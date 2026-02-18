import client from './client';
import { AnalyticsSummary, CategoryBreakdown, DailyTotal } from '../types';

export async function getSummary(period: string = 'month'): Promise<AnalyticsSummary> {
  const { data } = await client.get<AnalyticsSummary>('/api/analytics/summary', { params: { period } });
  return data;
}

export async function getByCategory(
  type: 'INCOME' | 'EXPENSE',
  dateFrom?: string,
  dateTo?: string,
): Promise<CategoryBreakdown[]> {
  const params: Record<string, string> = { type };
  if (dateFrom) params.date_from = dateFrom;
  if (dateTo) params.date_to = dateTo;
  const { data } = await client.get<CategoryBreakdown[]>('/api/analytics/by-category', { params });
  return data;
}

export async function getDailyTotals(month: number, year: number): Promise<DailyTotal[]> {
  const { data } = await client.get<DailyTotal[]>('/api/analytics/daily', { params: { month, year } });
  return data;
}
