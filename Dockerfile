# Use Node.js LTS version
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose the port your app runs on
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production

# Create a script to run migrations and start the app
RUN echo '#!/bin/sh\nnpm run migrate && npm start' > /app/start.sh
RUN chmod +x /app/start.sh

# Start the application with migrations
CMD ["/app/start.sh"]
