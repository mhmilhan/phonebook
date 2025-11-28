#!/bin/bash

echo "Build script started..."

# 1. Installing frontend dependencies and build
echo "Building Frontend..."
cd frontend
npm install
npm run build
cd ..

# 2. Move the built frontend to the backend
echo "Moving frontend build to backend..."
rm -rf backend/dist
cp -r frontend/dist backend/


# 3. Installing backend dependencies
echo "Installing Backend dependencies..."
cd backend
npm install

echo "Build script finished!"