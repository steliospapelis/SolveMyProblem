#!/bin/bash
docker-compose down --rmi local
# Remove the Docker images used by your services
docker-compose rm -f -v

echo "All containers,their volumes and images have been removed"