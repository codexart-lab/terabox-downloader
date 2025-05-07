# Use official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy rest of the code
COPY . .

# Expose the port
EXPOSE 8080

# Start the bot
CMD ["npm", "start"]
