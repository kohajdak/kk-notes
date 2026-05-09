# backend/Dockerfile
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --no-fund
COPY . .

FROM node:24-alpine AS runtime
WORKDIR /app
COPY --from=builder /app ./
ENV NODE_ENV=production
RUN npm ci --omit=dev --no-fund
CMD ["node", "index.js"]
