import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Cho phép lắng nghe trên tất cả địa chỉ IP
    port: 5173, // Đảm bảo cổng đúng
  },
});
