# Backend Dockerfile

# 1. Use a specific, lightweight Node.js base image.
FROM node:20-alpine

# 2. Set the working directory inside the container.
WORKDIR /app

# 3. Copy only the package manifest files first.
COPY package*.json ./

# 4. Install production dependencies only (skip devDependencies since not needed at runtime).
RUN npm ci --omit=dev

# 5. Copy the remaining application source code into the image.
COPY . .

# 6. Create a non-root user and group for running the application.
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# 7. Change ownership of the app directory to the non-root user
RUN chown -R appuser:appgroup /app

# 8. Switch to the non-root user for all subsequent commands and when running the container.
USER appuser

# 9. Expose the port the application listens on.
EXPOSE 5000

# 10. Define the default command to start the application.
CMD ["npm", "start"]