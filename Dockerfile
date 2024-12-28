FROM golang:1.23.4 AS backend-builder

# Set working directory for the backend
WORKDIR /backend

# Copy backend source code into the container
COPY ./backend /backend

# Install Go dependencies
RUN go mod tidy

# Build the Go binary
RUN go build -o app .

# Expose the necessary ports
EXPOSE 80 8080

# Start both NGINX and the Go backend (using a shell script or supervisor)
CMD ["sh", "-c", "/backend/app"]

