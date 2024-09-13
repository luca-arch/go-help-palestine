# Bundler
FROM node:22.7.0-bookworm-slim AS assets

WORKDIR /tmp

COPY *.json .
COPY *.ts .
RUN npm install

COPY ./public ./public/
COPY ./src ./src/
COPY ./index.html ./index.html
RUN npm run build

# Nginx
FROM nginx:1.27-alpine3.20

COPY --from=assets /tmp/dist /mnt/html
COPY nginx.conf /etc/nginx/nginx.conf

# Pre-compress static files.
RUN find /mnt/html -type f -exec gzip -k9 {} \;

EXPOSE 8080