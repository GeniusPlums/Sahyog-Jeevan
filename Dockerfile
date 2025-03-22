# Use Node.js LTS version
FROM node:20-slim AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build stage for client and server
FROM base AS build
RUN npm run build

# Production stage
FROM node:20-slim AS production

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm install --production

# Copy built files from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/migrations ./migrations
COPY --from=build /app/db ./db

# Expose the port your app runs on
EXPOSE 8000

# Set environment variables
ENV NODE_ENV=production

# Copy the migration script to ensure it's available
COPY db/migrate.ts ./db/

# Create a script to run migrations and start the app
RUN echo '#!/bin/sh\nnpm run migrate && npm start' > /app/start.sh
RUN chmod +x /app/start.sh

# Start the application with migrations
CMD ["sh", "/app/start.sh"]
