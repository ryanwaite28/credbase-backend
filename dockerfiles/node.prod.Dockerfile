FROM node:16-alpine

WORKDIR /app

RUN npm i -g webpack

COPY package.json /app

RUN npm i

COPY . /app

ARG APP_ENTRY_POINT
ARG APP_FILE_NAME
ARG APP_DIR
ARG APP_STATIC

ENV APP_ENTRY_POINT ${APP_ENTRY_POINT}
ENV APP_FILE_NAME ${APP_FILE_NAME}
ENV APP_DIR ${APP_DIR}
ENV APP_STATIC ${APP_STATIC}

RUN ls -atl

EXPOSE 80

ENV RUN_CMD "npm run webpack -- --watch --env entry=${APP_ENTRY_POINT} --env app=${APP_FILE_NAME} --env dir=${APP_DIR} --env static=${APP_STATIC}"

CMD $RUN_CMD

# CMD [ "npm" , "run" , "webpack" , "--" , "--watch" , "--env" , "entry=" , $APP_ENTRY_POINT , "--env" , "app=${APP_FILE_NAME}" , "--env dir=${APP_DIR}" , "--env" , "static=${APP_STATIC}" ]