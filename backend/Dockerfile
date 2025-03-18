FROM node:18

COPY package.json /app/
COPY . /app/

WORKDIR /app

RUN npm install

CMD ["node", "server.js"]
