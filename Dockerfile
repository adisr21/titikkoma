# ========================
# 1. Build stage
# ========================
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# ========================
# 2. Production stage
# ========================
FROM node:20-alpine

WORKDIR /app

# hanya copy hasil + package.json
COPY --from=build /app/package*.json ./
RUN npm install --omit=dev

COPY --from=build /app/build ./build

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

EXPOSE 3000

CMD ["npm", "run", "start"]