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
        this.user = user;

        // Lưu LocalStorage
        localStorage.setItem('user', JSON.stringify(user));

        // Redirect
        router.push(this.returnUrl || '/dashboard/default');

      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },

    async checkAuth() {
      // Nếu đã có user trong store rồi thì không cần check lại (tối ưu performance)
      if (this.user) return true;

      this.isChecking = true;
      try {
        // Gọi lên server hỏi: "Tao là ai?"
        const user = await userService.getProfile();
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