FROM node:20-alpine
WORKDIR /app

# Install dockerode dep (native bindings not needed since we use socket)
COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

CMD ["node", "dist/index.js"]