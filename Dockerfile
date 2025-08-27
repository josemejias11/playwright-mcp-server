# Simple single-stage Dockerfile for Playwright MCP Server
FROM node:22-alpine3.21

# Install system dependencies
RUN apk update && apk add --no-cache \
    wget \
    gnupg \
    ca-certificates \
    curl \
    git \
    bash \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ttf-freefont \
    && apk upgrade --no-cache

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Install Playwright browsers 
RUN npx playwright install chromium

# Copy all source code
COPY . .

# Build the project
RUN npm run build

# Create required directories
RUN mkdir -p reports/e2e reports/api reports/artifacts/screenshots reports/artifacts/videos reports/artifacts/traces test-results

# Create non-root user for security
RUN addgroup -g 1001 -S playwright && \
    adduser -S -D -H -u 1001 -s /sbin/nologin -G playwright playwright
RUN chown -R playwright:playwright /app
USER playwright

# Set environment
ENV NODE_ENV=test
ENV HEADLESS=true

# Default command runs comprehensive tests
CMD ["npm", "run", "test:all"]
