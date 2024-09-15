FROM node:18.15-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

CMD [ "node", "dist/main.js" ]