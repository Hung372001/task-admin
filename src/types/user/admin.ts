export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

// Interface cho response chuẩn từ Backend (nếu có wrapper)
export interface ApiResponse<T> {
  status: string;
  data: T;
  message: string;
}