# Step 1: Use official Node.js image as a base image for building the app
# The 'alpine' version is used to keep the image size small
FROM node:23-alpine

# Step 2: Set the working directory inside the container
# All subsequent commands will be run from this directory
WORKDIR /app

# Step 3: Copy the rest of the application source code into the container
# This includes all source files (e.g., TypeScript files, components, etc.)
COPY . .

# Step 4: Install application dependencies
# The 'npm install' command will use the package.json to install dependencies into /app/node_modules
RUN npm install

# Step 5: Build the TypeScript code
# This will compile the TypeScript files into JavaScript and output them to the /dist directory
RUN npm run build

# Step 6: Expose port 8080 for the application
# This makes the application accessible on port 8080 when the container is run
EXPOSE 3000

# Step 7: Define the command to run the Express app
CMD ["npm", "run", "serve"]