FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 2468

CMD ["npm", "start", "--", "-p", "2468"]
