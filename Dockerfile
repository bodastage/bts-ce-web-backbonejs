FROM node

RUN npm install webpack@3.4.1 -g

RUN npm install webpack-dev-server@2.6.1 -g

WORKDIR /app

COPY . /app/

RUN npm install

CMD ["/usr/local/bin/webpack-dev-server","--host 0.0.0.0","--disable-host-check","--hot"]

EXPOSE 8080