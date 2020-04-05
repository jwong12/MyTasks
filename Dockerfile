FROM node:lts-stretch-slim

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY . .

ENTRYPOINT npm start
