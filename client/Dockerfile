FROM node:latest

# Set the working directory in the container
WORKDIR /app

# Copy the application code
COPY . .

# Install dependencies
RUN npm install

# Build the client application
RUN npm run build

# Expose the port the client will run on
EXPOSE 4321

# Start the client application
CMD ["npm", "start"]