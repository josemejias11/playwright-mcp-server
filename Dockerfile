# Simple single-stage Dockerfile for Playwright MCP Server
FROM node:20-bullseye-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    procps \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Install Playwright browsers
RUN npx playwright install --with-deps

# Copy all source code
COPY . .

# Build the project
RUN npm run build

# Create required directories
RUN mkdir -p e2e/reports e2e/artifacts postman/reports

# Set environment
ENV NODE_ENV=test
ENV HEADLESS=true

# Default command runs comprehensive tests
CMD ["npm", "run", "test:all"]
