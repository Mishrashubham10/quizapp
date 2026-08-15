FROM node:26-bookworm-slim

WORKDIR /app

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

COPY prisma ./prisma
COPY prisma.config.ts ./

RUN npm ci

COPY tsconfig.json ./
COPY src ./src

COPY . .

RUN npm run build

EXPOSE 5500

CMD ["npm", "start"]