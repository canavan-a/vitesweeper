# WARNING: THIS IS BROKEN

# Stage 1: Build Node.js project
FROM node:16 AS node_builder

# Set working directory for Node.js project
WORKDIR /vitesweeper/client

# Copy package.json and package-lock.json
COPY client/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Node.js application
RUN npm run build

# Rename JS and CSS files
RUN mv dist/*.js dist/main.js && mv dist/*.css dist/main.css

# Stage 2: Build Golang application
FROM golang:1.17-alpine AS go_builder

# Set working directory for Golang project
WORKDIR /vitesweeper/server

# Copy Go module files and download dependencies
COPY server/go.mod .
COPY server/go.sum .
RUN go mod download

# Copy the rest of the application code
COPY server/ .

# Copy static files from the Node.js build stage
COPY --from=node_builder /vitesweeper/client/dist /vitesweeper/server/static

# Build the Go application
RUN go build -o myapp .

# Final stage: Create a lightweight container with the Go binary
FROM alpine:latest

# Set working directory for the final image
WORKDIR /vitesweeper

# Copy the Go binary and static files
COPY --from=go_builder /vitesweeper/server/myapp .
COPY --from=go_builder /vitesweeper/server/static /app/static

# Expose the port (adjust as needed)
EXPOSE 80

# Command to run the executable
CMD ["./myapp"]
