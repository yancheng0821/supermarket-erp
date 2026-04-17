FROM node:20-alpine AS builder

WORKDIR /workspace
COPY admin-web/package.json admin-web/pnpm-lock.yaml /workspace/admin-web/

WORKDIR /workspace/admin-web
RUN corepack enable && pnpm install --frozen-lockfile

WORKDIR /workspace
COPY admin-web /workspace/admin-web
COPY docker/nginx/default.conf /workspace/docker/nginx/default.conf

WORKDIR /workspace/admin-web
RUN pnpm build

FROM nginx:1.27-alpine

COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /workspace/admin-web/dist /usr/share/nginx/html
