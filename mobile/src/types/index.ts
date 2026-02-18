export interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

export interface Account {
  id: string;
  name: string;
  type: 'CARD' | 'BANK' | 'CASH' | 'E_WALLET';
  currency: string;
  balance: number;
  color: string | null;
  icon: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'INCOME' | 'EXPENSE';
  icon: string | null;
  color: string | null;
  is_default: boolean;
}

export interface Transaction {
  id: string;
  account_id: string;
  category_id: string | null;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  amount: number;
  description: string | null;
  date: string;
  related_transaction_id: string | null;
  category?: Category;
  account?: Account;
}

export interface TransactionFilters {
  date_from?: string;
  date_to?: string;
  category_id?: string;
  type?: string;
  account_id?: string;
  page?: number;
  size?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}

export interface Debt {
  id: string;
  type: 'DEBT' | 'RECEIVABLE';
  person_name: string;
  amount: number;
  currency: string;
  description: string | null;
  status: 'OPEN' | 'CLOSED';
  due_date: string | null;
  created_at: string;
}

export interface Budget {
  id: string;
  category_id: string | null;
  type: 'INCOME' | 'EXPENSE';
  month: number;
  year: number;
  planned_amount: number;
  category?: Category;
}

export interface BudgetComparison {
  category_name: string;
  planned: number;
  actual: number;
  percentage: number;
}

export interface AnalyticsSummary {
  total_income: number;
  total_expense: number;
  balance: number;
}

export interface CategoryBreakdown {
  category_name: string;
  category_color: string | null;
  amount: number;
  percentage: number;
}

export interface DailyTotal {
  date: string;
  income: number;
  expense: number;
}
