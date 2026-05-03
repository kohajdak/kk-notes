# backend/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

FROM node:20-alpine AS runtime
WORKDIR /app
COPY --from=builder /app ./
ENV NODE_ENV=production
RUN npm ci --production
CMD ["node", "index.js"]
