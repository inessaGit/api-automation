import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import 'dotenv/config';

export function createClient(baseURL: string): AxiosInstance {
  const client = axios.create({
    baseURL,
    timeout: Number(process.env.REQUEST_TIMEOUT_MS) || 10000,
    headers: { 'Content-Type': 'application/json' },
  });

  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const method = config.method?.toUpperCase() ?? 'UNKNOWN';
      const url = config.url ?? '';
      console.log(`[API REQUEST] ${method} ${baseURL}${url}`);
      return config;
    },
    (error: unknown) => {
      console.error('[API REQUEST ERROR]', error);
      return Promise.reject(error);
    }
  );

  client.interceptors.response.use(
    (response: AxiosResponse) => {
      const method = response.config.method?.toUpperCase() ?? 'UNKNOWN';
      const url = response.config.url ?? '';
      console.log(`[API RESPONSE] ${method} ${url} → ${response.status}`);
      return response;
    },
    (error: unknown) => {
      if (axios.isAxiosError(error)) {
        const method = error.config?.method?.toUpperCase() ?? 'UNKNOWN';
        const url = error.config?.url ?? '';
        const status = error.response?.status ?? 'NO_STATUS';
        const message = error.response?.data?.error ?? error.message;
        console.error(`[API ERROR] ${method} ${url} → ${status}: ${message}`);
      } else {
        console.error('[API ERROR] Unexpected error:', error);
      }
      return Promise.reject(error);
    }
  );

  return client;
}
