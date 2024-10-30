# Step 1: Use the specific Node.js version as a parent image
FROM node:18.13.0 AS build

# Step 2: Set the working directory inside the container
WORKDIR /aws-s3-app

# Step 3: Copy package.json and package-lock.json (if available)
COPY package.json package-lock.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of your application code
COPY . .

# Step 6: Build the application for production
RUN npm run build

# Step 7: Serve the application using Node.js
FROM node:18.13.0 AS production

# Set the working directory for the production stage
WORKDIR /aws-s3-app

# Copy the build files from the previous stage
COPY --from=build /aws-s3-app/build ./build

# Install serve globally to serve static files
RUN npm install -g serve

# Command to serve the application
CMD ["serve", "-s", "build", "-l", "3000"]

# Expose port 3000
EXPOSE 3000
