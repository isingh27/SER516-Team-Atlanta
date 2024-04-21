# Stage 1: Build the React application
FROM node:20.11 as builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to utilize Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code from your host to your image filesystem
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the built application using a Node.js static file server
FROM node:20.11

# Install 'serve' to serve static files on port 3000
RUN npm install -g serve

# Set the working directory in the container
WORKDIR /app

# Copy the 'build' directory from the builder stage to the current stage
COPY --from=builder /app/build .

# Expose port 3000 to be accessible from the outside
EXPOSE 3000

# Run the 'serve' command to serve the static files
CMD ["serve", "-s", ".", "-l", "3000"]
