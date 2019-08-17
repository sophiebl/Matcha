FROM node:alpine

LABEL maintainer="contact@alexandregv.fr"

WORKDIR /usr/src

ENV PATH /usr/src/node_modules/.bin:$PATH

RUN npm install --global nodemon
COPY package*.json ./
RUN npm install

EXPOSE 3001
CMD ["npm", "start"]
