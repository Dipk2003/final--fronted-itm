#!/bin/bash
# Build production version of iTech

echo "🏗️ Building iTech for Production..."

# Build backend
echo "📦 Building Backend..."
cd "D:\itech-backend\itech-backend"
mvn clean package -DskipTests

if [ $? -ne 0 ]; then
  echo "❌ Backend build failed!"
  exit 1
fi

# Build frontend
echo "🌐 Building Frontend..."
cd "C:\Users\Dipanshu pandey\OneDrive\Desktop\itm-main-fronted-main"
npm run build:production

if [ $? -ne 0 ]; then
  echo "❌ Frontend build failed!"
  exit 1
fi

echo "✅ Production build completed successfully!"
