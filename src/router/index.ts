import { createRouter, createWebHistory } from 'vue-router';
import MainRoutes from './MainRoutes';
import PublicRoutes from './PublicRoutes';
import { useAuthStore } from '@/stores/auth';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/pages/maintenance/error/Error404Page.vue')
    },
    MainRoutes,
    PublicRoutes
  ]
});

// --- NAVIGATION GUARD ---
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // 1. Xác định route này có cần Login không?
  // (Ưu tiên check meta.requiresAuth, mặc định là false nếu không khai báo)
  const isAuthRequired = to.matched.some((record) => record.meta.requiresAuth);

  // 2. Logic Check Session
  if (isAuthRequired) {
    // Nếu chưa có user trong store -> Gọi API check session
    if (!authStore.user) {
      const isValidSession = await authStore.checkAuth();

      if (!isValidSession) {
        // Session hỏng/Hết hạn -> Đá về Login
        authStore.returnUrl = to.fullPath;
        return next('/login');
      }
    }
  }

  // 3. Logic Redirect khi đã Login
  // Nếu đã Login (có user) mà cố tình vào trang Login -> Đá về Dashboard
  if (authStore.user && to.path === '/login') {
    // Lấy returnUrl hoặc về mặc định
    const redirectPath = authStore.returnUrl || '/dashboard/default';
    return next(redirectPath);
  }

  // 4. Cho phép đi tiếp
  next();
});

export default router;