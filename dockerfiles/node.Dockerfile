FROM node:16-alpine

WORKDIR /app

RUN npm i -g webpack

COPY package.json /app

RUN npm i

COPY . /app

ARG APP_ENTRY_POINT
ARG APP_FILE_NAME

RUN npm run webpack -- --env entry=$APP_ENTRY_POINT --env app=$APP_FILE_NAME

RUN ls -atl

EXPOSE 80

# CMD [ "nodemon" ]