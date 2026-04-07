source "$(dirname "$0")/config.bash"

sudo docker run -d \
  --name nginx \
  -p "${PROD_PORT}:80" \
  -v "${BUILDS_DIR}:/builds:ro" \
  -v "${NGINX_CONFIG_PATH}:/etc/nginx/conf.d/default.conf" \
  nginx:alpine
