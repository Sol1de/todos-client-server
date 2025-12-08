#-------Builder Section--------
FROM node:24 as builder

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

#-------Runner Section--------
FROM nginx:1.29.2 as runner

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist .

EXPOSE 80

#Api check
#HEALTHCHECK --interval=30s --timeout=15s --start-period=5s --retries=3 \
#    CMD node - e "require('http').get('http://localhost:3000/health').on('error', () => process.exit(1)).on('response', res => { if (res.statusCode !== 200) process.exit(1); else process.exit(0); })"