FROM node:18-alpine

WORKDIR /app

COPY . .

RUN yarn

EXPOSE 3000

ENTRYPOINT [ "/bin/sh -c yarn start" ] 
