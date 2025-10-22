# Use an official Node.js runtime
FROM node:20-alpine

# Create app directory and non-root user
WORKDIR /app
RUN addgroup -S botuser && adduser -S botuser -G botuser && \
    chown -R botuser:botuser /app

# Copy package files
COPY --chown=botuser:botuser package*.json ./

# Install dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy app source with correct permissions
COPY --chown=botuser:botuser . .

# Switch to non-root user
USER botuser

# Expose Express port (for health checks)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start the bot
CMD ["node", "index.js"]