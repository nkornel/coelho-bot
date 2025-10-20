# Use an official Node.js runtime
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy app source
COPY . .

# Expose Express port (for health checks)
EXPOSE 3000

# Start the bot
CMD ["npm", "start"]