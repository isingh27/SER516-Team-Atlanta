# Use an official Node runtime as a parent image
FROM node:20.11

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install any dependencies
RUN npm install

# Bundle app source
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run the app using npm start
CMD ["npm", "start"]
