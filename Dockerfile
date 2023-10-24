FROM node:20-alpine

ENV DATABASE_URL=postgres://fl0user:5V1vbpSFCQfW@ep-bold-bread-13477229.ap-southeast-1.aws.neon.fl0.io:5432/gdsc?sslmode=require \
    PORT=3000 \
    REDIS_URL=redis://default:38655a0591ff429eb66122f0361aa26c@us1-enough-sailfish-41406.upstash.io:41406


RUN npm install -g pnpm

WORKDIR /app

COPY . .

RUN pnpm install

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]


