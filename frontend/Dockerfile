# Frontend Dockerfile

# Stage 1 – builder: compile the React app into static assets
# Use official Node image
FROM node:24-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# ci gives a clean, reproducible install; all deps needed to build
RUN npm ci --ignore-scripts

# Copy all frontend files
COPY . .

# Pass the API URL at build time so Vite can bake it into the bundle
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

# Stage 2 – release: serve only the compiled static files
FROM node:24-alpine AS release

# "serve" is a minimal, production-grade static file server
RUN npm install -g serve@14 --ignore-scripts

# Set working directory
WORKDIR /app

# Copy only the compiled output – no source, no node_modules
COPY --from=builder /app/dist ./dist

# Create a non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Change ownership of the app directory to the non-root user
RUN chown -R appuser:appgroup /app

# Switch to the non-root user
USER appuser

# Expose the port the static file server listens on
EXPOSE 3000

# Start the static file server
CMD ["serve", "-s", "dist", "-l", "3000"]
