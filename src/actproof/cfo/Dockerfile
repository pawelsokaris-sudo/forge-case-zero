FROM node:18-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY index.js ./

RUN mkdir -p /app/evidence

EXPOSE 6000

CMD ["node", "index.js"]
