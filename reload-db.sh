#!/bin/bash

# Script to drop the database and reload data from data/problems.js

echo "Stopping any running backend server..."
lsof -ti :4000 | xargs kill -9 2>/dev/null

echo "Deleting existing database..."
rm -f problems.db

echo "Starting backend server to seed database..."
node server.js &
SERVER_PID=$!

# Wait for the server to finish seeding
echo "Waiting for database seeding to complete..."
sleep 3

echo "Stopping backend server..."
kill $SERVER_PID 2>/dev/null

echo "Database reloaded successfully!"
