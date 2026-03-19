# Stage 1: Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files dan install dependencies
COPY package*.json ./
RUN npm install

# Copy semua source code dan build project
COPY . .
RUN npm run build

# Stage 2: Production stage (menggunakan Nginx)
FROM nginx:stable-alpine

# Salin custom konfigurasi Nginx untuk handle React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Salin hasil build dari stage 1 ke folder default Nginx
# Catatan: Jika pakai Vite, folder hasil build biasanya 'build'. Jika CRA, biasanya 'build'.
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]