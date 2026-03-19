FROM node:20-alpine

WORKDIR /app

# Install only prod deps
COPY package*.json ./
RUN npm install --omit=dev

# Copy build output from local (faster CI/CD)
COPY . .

RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

EXPOSE 3000

CMD ["npm", "run", "start"]