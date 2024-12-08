# Use a base Node.js image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the client files
COPY client/ ./client

# Build the client application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3333

# Start the application
CMD ["npm", "start"]
