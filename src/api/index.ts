import axios from 'axios';
import type { AxiosInstance } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.example.com', // Lấy từ biến môi trường
  timeout: 10000, // 10 giây
  headers: {
    'Content-Type': 'application/json',
  },
});

//

// 2. Setup Interceptor cho Request (Gửi đi)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Setup Interceptor cho Response (Nhận về)
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Trả về data trực tiếp để đỡ phải gọi .data ở component
    return response.data;
  },
  (error: AxiosError) => {
    // Xử lý lỗi global (ví dụ: 401 Unauthorized -> logout)
    if (error.response && error.response.status === 401) {
      console.error('Hết phiên đăng nhập, vui lòng login lại.');
      // router.push('/login'); // Redirect về trang login
    }
    return Promise.reject(error);
  }
);

export default apiClient;