#-------Builder Section--------
FROM node:24-alpine AS builder

WORKDIR /usr/src/app

# Build server
COPY packages/server/package*.json ./packages/server/
RUN cd packages/server && npm install
COPY packages/server ./packages/server
RUN cd packages/server && npm run build

# Build client
COPY packages/client/package*.json ./packages/client/
RUN cd packages/client && npm install
COPY packages/client ./packages/client
RUN cd packages/client && npm run build

#-------Runner Section--------
FROM node:24-alpine

# Install nginx
RUN apk add --no-cache nginx

WORKDIR /app

# Copy server build + production dependencies
COPY --from=builder /usr/src/app/packages/server/dist ./server/dist
COPY --from=builder /usr/src/app/packages/server/package*.json ./server/
COPY --from=builder /usr/src/app/packages/server/src/data ./server/src/data
RUN cd server && npm install --omit=dev

# Copy client build to nginx html folder
COPY --from=builder /usr/src/app/packages/client/dist /usr/share/nginx/html

# Nginx config
COPY nginx.conf /etc/nginx/http.d/default.conf

EXPOSE 80

CMD ["sh", "-c", "node /app/server/dist/index.js & nginx -g 'daemon off;'"]