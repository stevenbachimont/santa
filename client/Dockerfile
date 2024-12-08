# Use a base Node.js image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if present)
COPY client/package*.json /app/

# Install dependencies
RUN npm install

# Copy the client files
COPY client/ /app/

# Build the client application
RUN npm run build

# Install a simple HTTP server to serve the built React app (optional, if you want to serve the app)
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 3333

# Start the application using serve
CMD ["serve", "-s", "build", "-l", "3333"]
