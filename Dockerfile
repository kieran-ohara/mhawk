ARG NODE_VERSION=14
FROM node:$NODE_VERSION-alpine

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY cli ./cli
COPY components ./components
COPY containers ./containers
COPY hooks ./hooks
COPY lib ./lib
COPY next.config.js ./next.config.js
COPY pages ./pages
COPY public ./public
COPY styles ./styles
COPY webpack.config.js ./webpack.config.js
COPY .eslintrc.js ./.eslintrc.js

RUN npm run build

RUN rm -rf ./node_modules && npm install --production

EXPOSE 3000

CMD ["./node_modules/.bin/next", "start"]
