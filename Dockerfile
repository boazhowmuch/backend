FROM gcr.io/google.com/cloudsdktool/google-cloud-cli:alpine

RUN apk --update add openjdk7-jre
RUN gcloud components install app-engine-java kubectl

RUN gcloud init

WORKDIR /app

# google 서비스 키 환경변수 전달
ENV GOOGLE_APPLICATION_CREDENTIALS="conf/test-chatbot-ko-xcvj-495835caf81e.json"

RUN apk add --update npm

COPY . .

# package 설치
RUN npm install

# http
EXPOSE 3000

# https
EXPOSE 3003

CMD ["npm", "start"]