# Stage 1: Build the Angular application
FROM node:20-alpine3.19 as build-stage

WORKDIR /app

# Accept build environment (default to development)
ARG ENV=dev

COPY package*.json /app/

RUN npm install

COPY . /app

# Copy the correct environment file based on the build argument
# Assuming your environment files are named `.env.dev`, `.env.prod`, etc.
COPY .env.${ENV} /app/.env

RUN npm run ng build --configuration=${ENV}

# Stage 2: Set up the Express server
FROM node:20-alpine3.19 as production-stage

WORKDIR /app

COPY package*.json /app/

RUN npm install --only=production

# Copy the built Angular app from the previous stage
COPY --from=build-stage /app/dist/client /app

COPY server.js /app/

# Set environment variable for port based on build environment
ARG ENV=dev

# For development, expose port 3350; for production, expose port 3338
ENV PORT=3350
RUN if [ "$ENV" = "prod" ]; then export PORT=3338; fi

EXPOSE $PORT

CMD ["node", "server.js"]
