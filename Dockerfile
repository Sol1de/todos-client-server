#-------Builder Section--------
FROM node:24 AS builder

WORKDIR /usr/src/app

COPY packages/server/package*.json .

RUN npm install

COPY ./packages/server .

RUN npm run build

#-------Runner Section--------
FROM node:24-alpine AS runner

WORKDIR /usr/src/app

# on copie le build et les fichiers package depuis le stage builder
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json .

# on installe uniquement les dépendances de production
RUN npm install --omit=dev

# on expose le port de l'API Express
EXPOSE 3001

# on lance le serveur
CMD ["node", "dist/index.js"]
