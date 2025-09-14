FROM rabbitmq:3.13.1-management-alpine

RUN apk add --no-cache shadow openssl

RUN usermod -u 1000 rabbitmq

EXPOSE 5672 15672
