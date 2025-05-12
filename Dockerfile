FROM node:22-alpine

WORKDIR /home/node/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run prisma:generate  # Generate during build
CMD ["npm", "run", "start"]