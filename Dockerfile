# Stage 1: Build stage
FROM node:20-alpine as build

# Install dependencies for building native modules
RUN apk add --no-cache make gcc g++ python3

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy app code
COPY . .

# Stage 2: Final stage
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy only necessary files from build stage
COPY --from=build /app /app

# Expose port
EXPOSE 3001

# Start the app
CMD ["node", "server.mjs"]
