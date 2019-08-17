FROM node:alpine

LABEL maintainer="contact@alexandregv.fr"

WORKDIR /usr/src

ENV PATH /usr/src/node_modules/.bin:$PATH

ADD package.json /usr/src/package.json
RUN npm install

EXPOSE 3000
CMD ["npm", "start"]
