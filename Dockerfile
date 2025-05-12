# Sử dụng Node.js 20 thay vì Node.js 14
FROM node:20

# Đặt thư mục làm việc trong container
WORKDIR /app

# Sao chép file package.json và package-lock.json (nếu có) để cài đặt dependencies trước
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Mở cổng 5173 (mặc định của Vite)
EXPOSE 5173

# Xóa cache để tránh lỗi Vite hot reload
RUN npm cache clean --force

# Chạy ứng dụng bằng Vite (npm run dev)
CMD ["npm", "run", "dev"]
