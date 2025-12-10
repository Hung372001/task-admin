import { defineStore } from 'pinia';
import { router } from '@/router';
import type { User } from '@/types/user';
import { authService } from '@/api/services/authService.ts';

interface AuthState {
  user: User | null;
  returnUrl: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    returnUrl: null,
  }),

  actions: {
    async login(email: string, password: string) {
      try {
        const user = await authService.login( email, password );
        // Cập nhật State
        this.user = user.accessToken ;

        // Lưu LocalStorage
        localStorage.setItem('accessToken',  user.accessToken);

        // Redirect
        router.push(this.returnUrl || '/dashboard/default');

      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },

    async checkAuth() {
      if (this.user) return true;

      this.isChecking = true;
      try {
        const user = await authService.getProfile();
        this.user = user;
        return true; // Session OK
      } catch (error) {
        console.log('Auth check failed:', error);
        this.user = null;
        return false; // Session Hết hạn/Lỗi
      } finally {
        this.isChecking = false;
      }
    },

    logout() {
      this.user = null;
      this.returnUrl = null;
      localStorage.removeItem('user');
      router.push('/login');
    }
  }

});