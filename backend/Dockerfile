# Production Dockerfile for Clinic Management System
FROM node:18-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm install --production

COPY backend ./

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "server.js"]
