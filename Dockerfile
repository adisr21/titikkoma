# Stage 1: Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production stage
FROM nginx:stable-alpine
# Copy the INTERNAL config (app.nginx.conf)
COPY app.nginx.conf /etc/nginx/conf.d/default.conf
# IMPORTANT: Check if your build folder is 'dist' or 'build'
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]