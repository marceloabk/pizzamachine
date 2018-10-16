FROM node:latest

WORKDIR /usr/app

RUN npm install nodemon -g

RUN npm install knex -g

COPY package.json .
RUN npm install

COPY . .

CMD ["npm", "start"]
