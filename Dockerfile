# Etapa de build
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Compila o TypeScript (se estiver usando)
RUN npm run build

# Etapa de produção
FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app /app
RUN npm install --omit=dev

EXPOSE 8080
CMD ["node", "dist/index.js"]
