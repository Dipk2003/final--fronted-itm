#!/bin/bash
# Start development servers for iTech

echo "🚀 Starting iTech Development Servers..."

# Start backend server
echo "📦 Starting Backend Server..."
cd "D:\itech-backend\itech-backend"
mvn spring-boot:run &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 30

# Start frontend server
echo "🌐 Starting Frontend Server..."
cd "C:\Users\Dipanshu pandey\OneDrive\Desktop\itm-main-fronted-main"
npm run dev &
FRONTEND_PID=$!

echo "✅ Both servers started!"
echo "📝 Backend running at: http://localhost:8080"
echo "🌐 Frontend running at: http://localhost:3001"
echo "💡 Press Ctrl+C to stop all servers"

# Wait for user to stop
wait

# Cleanup
echo "🛑 Stopping servers..."
kill $BACKEND_PID $FRONTEND_PID
echo "✅ All servers stopped!"
