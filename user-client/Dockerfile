# create node 18 base image on alpine
FROM node:16-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json package.json

RUN npm i

COPY . .

RUN npm run build

RUN rm -rf ./node_modules

RUN npm i -g serve

CMD [ "serve", "-s", "build" ]
