FROM node:14-alpine

ADD . server/

WORKDIR /server

RUN npm i

CMD npm start