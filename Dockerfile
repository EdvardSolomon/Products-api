FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN yarn

COPY . .

RUN npx prisma generate
RUN yarn prisma:migrate

RUN yarn build


EXPOSE 3000

CMD ["node", "dist/main"]
