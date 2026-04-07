#!/bin/bash

# Application
APP_NAME="titikkoma"

# Directories
PROJECT_DIR="${HOME}/${APP_NAME}"
BUILDS_DIR="${HOME}/builds"

# Nginx
PROD_PORT=3000
VERIFY_PORT=3001
NGINX_CONTAINER="nginx"
VERIFY_CONTAINER_NAME="verify_nginx"

# Nginx paths
NGINX_CONFIG_PATH="${PROJECT_DIR}/deploy/nginx/nginx.conf"
