FROM node:18-alpine

RUN apk add --no-cache docker-cli docker-compose

WORKDIR /app

COPY package.json ./
RUN npm install

COPY index.js ./

RUN mkdir -p /app/evidence

EXPOSE 5000

CMD ["node", "index.js"]
