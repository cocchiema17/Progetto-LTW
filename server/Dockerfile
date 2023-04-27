FROM node:alpine as debug
WORKDIR /app
COPY ./package.json ./
RUN npm install
RUN npm install -g nodemon
COPY . .
EXPOSE 4000/tcp
EXPOSE 9229/tcp
CMD ["nodemon", "--inspect=0.0.0.0", "./src/index.js"]

FROM node:alpine as prod
WORKDIR /app
COPY ./package.json ./
RUN npm install
COPY . .
EXPOSE 4000/tcp
CMD ["npm", "run", "start"]