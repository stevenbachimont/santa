# Use a base Node.js image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the server files
COPY server/ ./server

# Expose the port the app runs on
EXPOSE 5001

# Start the application
CMD ["node", "server/server.js"]
