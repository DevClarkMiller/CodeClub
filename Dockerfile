FROM node:22

# Install basic dependencies (Debian uses apt-get)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    bash \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /home/node/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run prisma:generate  # Generate during build
CMD ["npm", "run", "start"]