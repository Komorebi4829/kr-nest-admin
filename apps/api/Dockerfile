FROM node:18.20-alpine
VOLUME /home/app
WORKDIR /home/app
ENV TZ Asia/Shanghai
RUN npm install -g pm2
COPY . /home/app
EXPOSE 3000
CMD ["pm2", "restart", "main.js", "--name", "kr-nest-admin"]
