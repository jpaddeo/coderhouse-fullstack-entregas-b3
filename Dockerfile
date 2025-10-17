FROM node:alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:alpine AS production
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
