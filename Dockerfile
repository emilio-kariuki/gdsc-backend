FROM node:18-alpine

ENV DATABASE_URL=postgres://test_t425_user:sTa9J0NgwkIUOQfYwLOjP8KCGIZJl3tD@dpg-ckim804e1qns738e68l0-a.oregon-postgres.render.com/test_t425 \
    PORT=3000


RUN npm install -g pnpm

WORKDIR /app

COPY . .

RUN pnpm install

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]


