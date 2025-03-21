FROM node:16-alpine

WORKDIR /app

COPY package.json ./

# Install dependencies using --legacy-peer-deps (if required)
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3000
CMD ["npm", "start"]
