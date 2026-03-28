import { z } from 'zod';

export const reqResUserDataSchema = z.object({
  id: z.number().int().positive(),
  email: z.string().email(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  avatar: z.string().url(),
});

export type ReqResUserData = z.infer<typeof reqResUserDataSchema>;

export const supportSchema = z.object({
  url: z.string().url(),
  text: z.string().min(1),
});

export const userListResponseSchema = z.object({
  page: z.number().int().positive(),
  per_page: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  total_pages: z.number().int().positive(),
  data: z.array(reqResUserDataSchema),
  support: supportSchema,
});

export type UserListResponse = z.infer<typeof userListResponseSchema>;

export const singleUserResponseSchema = z.object({
  data: reqResUserDataSchema,
  support: supportSchema,
});

export type SingleUserResponse = z.infer<typeof singleUserResponseSchema>;

export const loginResponseSchema = z.object({
  token: z.string().min(1),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;

export const registerResponseSchema = z.object({
  id: z.number().int().positive(),
  token: z.string().min(1),
});

export type RegisterResponse = z.infer<typeof registerResponseSchema>;

export const authErrorSchema = z.object({
  error: z.string().min(1),
});

export type AuthError = z.infer<typeof authErrorSchema>;
