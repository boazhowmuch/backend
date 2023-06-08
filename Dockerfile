FROM node:18-alpine

RUN apk update && apk add mysql-client

WORKDIR /app

COPY . .

RUN yarn

EXPOSE 3000

ENTRYPOINT [ "/bin/sh", "-c", "yarn start" ] 
