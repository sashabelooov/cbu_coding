import * as SecureStore from 'expo-secure-store';
import client from './client';
import { User } from '../types';

interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await client.post<AuthResponse>('/api/auth/login', { email, password });
  await SecureStore.setItemAsync('token', data.access_token);
  return data;
}

export async function register(email: string, password: string, full_name: string): Promise<AuthResponse> {
  const { data } = await client.post<AuthResponse>('/api/auth/register', { email, password, full_name });
  await SecureStore.setItemAsync('token', data.access_token);
  return data;
}

export async function logout(): Promise<void> {
  await SecureStore.deleteItemAsync('token');
}

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync('token');
}
