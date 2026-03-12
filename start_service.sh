#!/bin/bash

# Define cleanup function to kill background processes on exit
cleanup() {
    echo "Stopping Drive on Git services..."
    # Kill all background processes started by this script
    kill $(jobs -p) 2>/dev/null
    exit
}

# Trap SIGINT (Ctrl+C) and SIGTERM
trap cleanup SIGINT SIGTERM

echo "========================================="
echo "Cleaning up ports (5000, 5173)..."
fuser -k 5000/tcp 5173/tcp 2>/dev/null
echo "Starting Drive on Git Local Environment..."
echo "========================================="

echo "Starting Backend API..."
cd backend
npm run dev &
cd ..

echo "Starting Frontend SPA..."
cd frontend
npm run dev &
cd ..

echo "========================================="
echo "Services are starting up!"
echo "Backend is typically running on http://localhost:5000"
echo "Frontend is typically running on http://localhost:5173"
echo "Press Ctrl+C at any time to stop both services."
echo "========================================="

# Wait for all background processes to keep script running
wait
