# Backend Dockerfile

# Stage 1 - builder: install only production dependencies

# 1. Use a specific, lightweight Node.js base image.
FROM node:24-alpine AS builder

# 2. Set the working directory inside the container.
WORKDIR /app

# 3. Copy only the package manifest files first.
COPY package*.json ./

# 4. Install production dependencies in a clean, reproducible way.
RUN npm ci --omit=dev --ignore-scripts

# Stage 2 - release: create a lean final image
FROM node:24-alpine AS release

# 1. Install curl (healthcheck only)
RUN apk add --no-cache curl

# 2. Set the working directory inside the container.
WORKDIR /app

# 3. Copy only the installed node_modules from the builder stage.
COPY --from=builder /app/node_modules ./node_modules

# 4. Copy the remaining application source code into the image.
COPY . .

# 5. Create a non-root user and group for running the application.
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# 6. Change ownership of the app directory to the non-root user
RUN chown -R appuser:appgroup /app

# 7. Switch to the non-root user for all subsequent commands and when running the container.
USER appuser

# 8. Expose the port the application listens on.
EXPOSE 5000

# 9. Migrate the database and start the server using a single command.
CMD ["sh", "-c", "node migrate.js && node server.js"]