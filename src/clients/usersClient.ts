import { AxiosResponse } from 'axios';
import 'dotenv/config';
import { createClient } from './baseClient';

export interface ReqResUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface ReqResUserData {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface UserListResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: ReqResUserData[];
  support: {
    url: string;
    text: string;
  };
}

export interface SingleUserResponse {
  data: ReqResUserData;
  support: {
    url: string;
    text: string;
  };
}

export interface LoginResponse {
  token: string;
}

export interface RegisterResponse {
  id: number;
  token: string;
}

export interface AuthErrorResponse {
  error: string;
}

const client = createClient(
  process.env.REQRES_BASE_URL ?? 'https://reqres.in/api'
);

export const usersClient = {
  getAll(page?: number): Promise<AxiosResponse<UserListResponse>> {
    const params = page !== undefined ? { page } : {};
    return client.get<UserListResponse>('/users', { params });
  },

  getById(id: number): Promise<AxiosResponse<SingleUserResponse>> {
    return client.get<SingleUserResponse>(`/users/${id}`);
  },

  login(
    email: string,
    password: string
  ): Promise<AxiosResponse<LoginResponse>> {
    return client.post<LoginResponse>('/login', { email, password });
  },

  register(
    email: string,
    password: string
  ): Promise<AxiosResponse<RegisterResponse>> {
    return client.post<RegisterResponse>('/register', { email, password });
  },
};
