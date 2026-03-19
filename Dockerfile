# Build stage
FROM node:20 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM node:20

# Install nginx
RUN apt-get update && apt-get install -y nginx

WORKDIR /app

# Copy app
COPY --from=build /app /app

# Copy nginx config
COPY nginx.conf /etc/nginx/sites-available/default

# Remove default nginx config (optional safety)
RUN rm /etc/nginx/sites-enabled/default || true && \
    ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

# Expose port 80 (nginx)
EXPOSE 80

# Start both nginx + node
CMD service nginx start && npm run start