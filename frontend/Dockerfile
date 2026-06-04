FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY public ./public
COPY src ./src
COPY vite.config.js ./
COPY index.html ./

CMD ["npm", "run", "dev"]

