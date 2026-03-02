FROM node:18-alpine

WORKDIR /app

ARG VARIANT=heavy
ENV VARIANT=${VARIANT}

COPY package.json ./
RUN npm install

COPY index.js ./

EXPOSE 3000

CMD ["node", "index.js"]
