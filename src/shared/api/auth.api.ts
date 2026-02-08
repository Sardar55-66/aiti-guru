import { api } from './axios';
import type { LoginResponse } from '../types/auth';

export const loginRequest = (data: {
  username: string;
  password: string;
}) => api.post<LoginResponse>('/auth/login', data);
