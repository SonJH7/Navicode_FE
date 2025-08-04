const BASE_URL = 'http://222.122.81.141:5000';

interface AuthResponse {
  success: boolean;
  token: string | null;
  message: string;
}

export async function loginApi(username: string, password: string) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data: AuthResponse = await res.json();
  if (!data.success) {
    throw new Error(data.message);
  }
  return { token: data.token as string };
}

export async function registerApi(username: string, password: string) {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data: AuthResponse = await res.json();
  if (!data.success) {
    throw new Error(data.message);
  }
}