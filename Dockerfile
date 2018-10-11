FROM node:latest

WORKDIR /usr/app

RUN npm install nodemon -g

COPY package.json .
RUN npm install

COPY . .

RUN useradd -m myuser
USER myuser

CMD ["npm", "start"]
