#!/bin/bash
export $(grep -v '^#' .env | xargs) # Loads variables from .env

docker-compose up -d

# Wait for a few seconds to ensure the services start up
sleep 5

# Open the browser at localhost:3001
start http://localhost:3001
