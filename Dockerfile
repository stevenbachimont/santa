#syntax=docker/dockerfile:1.4
FROM node:20-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /usr/src/app

RUN corepack enable && \
 corepack prepare --activate pnpm@latest && \
 pnpm config -g set store-dir /.pnpm-store

COPY --link ./server/package.json ./server/
COPY --link ./client/package.json ./client/

RUN cd client && \
    pnpm fetch && \
    pnpm install
RUN cd server && \
    pnpm fetch && \
    pnpm install

COPY ./client ./client
COPY ./server ./server

# Default command
CMD ["sh", "-c", "echo 'Specify a command to run'"]