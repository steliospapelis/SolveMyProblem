FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Temporarily use a shell instead of starting the app
CMD ["node", "app.js"]
