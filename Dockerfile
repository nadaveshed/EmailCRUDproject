# Use the official Node.js image as a base
FROM node:16 AS build

# Set the working directory (adjusting to match where your app is)
WORKDIR /email-app-frontend

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Use a lightweight server for serving the app
FROM nginx:alpine

# Copy the build output to the Nginx html directory
COPY --from=build /email-app-frontend/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
