# Use an official Node.js runtime as a parent image
FROM node:21-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json to /app
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to /app
COPY . .

# Expose port 4000
EXPOSE 4000

# Start the application
CMD ["npm", "run", "devStart"]