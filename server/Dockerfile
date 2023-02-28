# create node 18 base image on alpine
FROM node:18-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json package.json

RUN npm i

COPY . .

CMD [ "npm", "run", "start" ]
