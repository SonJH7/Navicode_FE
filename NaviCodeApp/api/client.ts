export const BASE_URL = 'http://222.122.81.141:8080/api';

interface RequestOptions {
  method?: string;
  body?: unknown;
}

export async function request<T>(
  endpoint: string,
  { method = 'GET', body }: RequestOptions = {},
): Promise<T> {
  let url = `${BASE_URL}${endpoint}`;
  const options: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };

  if (method.toUpperCase() === 'GET' && body && typeof body === 'object') {
    const params = new URLSearchParams(body as Record<string, string>);
    url += `?${params.toString()}`;
  } else if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url, options);
  return res.json() as Promise<T>;
}
