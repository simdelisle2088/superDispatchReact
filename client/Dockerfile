# Stage 1: Build the React application
FROM node:20-alpine3.19 as build-stage

# Set working directory
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json /app/

# Install all dependencies, including papaparse
# We use ci instead of install for more reliable builds
RUN npm ci && \
    npm install papaparse && \
    # Clean npm cache to reduce image size
    npm cache clean --force

# Copy the rest of the application code
COPY . /app/

# Set build-time arguments with a default value
ARG ENV=prod

# Set NODE_ENV to match our build environment
ENV NODE_ENV=$ENV

# Run the appropriate build command based on environment
RUN if [ "$ENV" = "dev" ]; then \
        echo "Building for development..." && \
        npm run build:dev; \
    elif [ "$ENV" = "prod" ]; then \
        echo "Building for production..." && \
        npm run build:prod; \
    else \
        echo "Building with default configuration..." && \
        npm run build; \
    fi

# Stage 2: Production environment
FROM node:20-alpine3.19 as production-stage

# Set working directory for production
WORKDIR /app

# Copy package files
COPY package*.json /app/

# Install only production dependencies
# Using ci instead of install for consistent installations
RUN npm ci --only=production && \
    # Clean npm cache to reduce image size
    npm cache clean --force

# Copy built assets from build stage
COPY --from=build-stage /app/build /app/build

# Copy server file
COPY server.js /app/

# Expose the application port
EXPOSE 3338
# EXPOSE 3350

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3338/health || exit 1

# Use node directly instead of npm for better signal handling
CMD ["node", "server.js"]