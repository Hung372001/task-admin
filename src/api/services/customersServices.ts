import apiClient from '@/api';

export const customersServices = {
  // login(email: string, password: string) {
  //   return apiClient.post('/auth/login', { email, password });
  // },
  // getProfile() {
  //   return apiClient.get(`/auth/profile`);
  // },
  //
  //
  //
  // create(data: Omit<User, 'id'>) {
  //   return apiClient.post<User>('/users', data);
  // }

  getCustomers(page) {
    return apiClient.get('/auth/customers', { params: page });
  }
};