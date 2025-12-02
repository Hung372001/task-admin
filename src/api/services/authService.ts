
import type { User } from '@/types/user';
import apiClient from '@/api';

export const authService = {
  login(email: string, password: string) {
    return apiClient.post('/auth/login', { email, password });
  },
  getProfile() {
    return apiClient.get(`/auth/profile`);
  },
  create(data: Omit<User, 'id'>) {
    return apiClient.post<User>('/users', data);
  }
};