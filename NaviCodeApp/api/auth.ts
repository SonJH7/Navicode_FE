import { request } from './client';

interface AuthResponse {
  success: boolean;
  token: string | null;
  message: string;
}

export async function loginApi(username: string, password: string) {
  const data = await request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: { username, password },
  });
  if (!data.success) {
    throw new Error(data.message);
  }
  return { token: data.token as string };
}

export async function registerApi(username: string, password: string) {
  const data = await request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: { username, password },
  });
  if (!data.success) {
    throw new Error(data.message);
  }
}
