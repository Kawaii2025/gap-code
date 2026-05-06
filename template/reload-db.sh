#!/bin/bash
# Reload the database with seed data

echo "Stopping any running backend server..."
pkill -f "node server.js" 2>/dev/null || true

# Delete old db file if using SQLite
if [ -f "data.db" ]; then
  echo "Deleting existing database..."
  rm data.db
fi

# Start backend to seed db
echo "Starting backend server to seed database..."
node server.js &
SERVER_PID=$!

# Wait a bit for seeding
echo "Waiting for database seeding to complete..."
sleep 3

# Stop the server
echo "Stopping backend server..."
kill $SERVER_PID 2>/dev/null || true

echo "Database reloaded successfully!"
