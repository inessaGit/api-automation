import { AxiosResponse } from 'axios';
import 'dotenv/config';
import { createClient } from './baseClient';

export interface Post {
  id?: number;
  userId: number;
  title: string;
  body: string;
}

export interface PostPayload {
  userId: number;
  title: string;
  body: string;
}

export interface PatchPostPayload {
  userId?: number;
  title?: string;
  body?: string;
}

const client = createClient(
  process.env.JSONPLACEHOLDER_BASE_URL ?? 'https://jsonplaceholder.typicode.com'
);

export const postsClient = {
  getAll(): Promise<AxiosResponse<Post[]>> {
    return client.get<Post[]>('/posts');
  },

  getById(id: number): Promise<AxiosResponse<Post>> {
    return client.get<Post>(`/posts/${id}`);
  },

  create(payload: PostPayload): Promise<AxiosResponse<Post>> {
    return client.post<Post>('/posts', payload);
  },

  update(id: number, payload: PostPayload): Promise<AxiosResponse<Post>> {
    return client.put<Post>(`/posts/${id}`, payload);
  },

  patch(id: number, payload: PatchPostPayload): Promise<AxiosResponse<Post>> {
    return client.patch<Post>(`/posts/${id}`, payload);
  },

  remove(id: number): Promise<AxiosResponse<Record<string, never>>> {
    return client.delete<Record<string, never>>(`/posts/${id}`);
  },
};
