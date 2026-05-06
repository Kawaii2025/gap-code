#!/bin/bash

# Script to drop the database and reload data from data/problems.js

echo "Stopping any running backend server..."
lsof -ti :4000 | xargs kill -9 2>/dev/null

# Check if we're using Neon (PostgreSQL) or SQLite
if [ -n "$DATABASE_URL" ]; then
  echo "Using Neon (PostgreSQL). Note: You'll need to manually reset the database if you want to reseed."
  echo "Starting backend server to ensure tables are created..."
  node server.js &
  SERVER_PID=$!
  sleep 3
  echo "Stopping backend server..."
  kill $SERVER_PID 2>/dev/null
else
  echo "Deleting existing SQLite database..."
  rm -f problems.db
  echo "Starting backend server to seed SQLite database..."
  node server.js &
  SERVER_PID=$!
  # Wait for the server to finish seeding
  echo "Waiting for database seeding to complete..."
  sleep 3
  echo "Stopping backend server..."
  kill $SERVER_PID 2>/dev/null
fi

echo "Database reloaded successfully!"
