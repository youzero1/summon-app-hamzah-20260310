FROM node:20-alpine

RUN apk add --no-cache python3 make g++ sqlite

WORKDIR /app

COPY package.json ./

RUN npm i

COPY . .

RUN mkdir -p /app/data

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
