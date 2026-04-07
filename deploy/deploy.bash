#!/bin/bash

# This script is used to deploy the application to the production environment.
# It will build the application and copy the files to the "current" directory.
# Then, it will restart the nginx container to pick up the new files.

# Configuration
source "$(dirname "$0")/config.bash"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
NEW_BUILD_DIR="${BUILDS_DIR}/build-${TIMESTAMP}"

# -----------------------------------------------------------------------------
# Functions
# -----------------------------------------------------------------------------

function is_nginx_running() {
  # Verify production container is running on correct port
  sudo docker ps | grep -q "$NGINX_CONTAINER.*:$PROD_PORT->80"

  return $?
}

function npm_run_build() {
  export PATH=$PATH:${PROJECT_DIR}/node_modules/.bin

  npm run build --prefix "${PROJECT_DIR}" || return 1

  mkdir -p "$NEW_BUILD_DIR"
  cp -r "${PROJECT_DIR}/build/"* "$NEW_BUILD_DIR"
}

function is_build_successful() {
  [ -f "$NEW_BUILD_DIR/server/index.js" ]

  return $?
}

function run_nginx_verify_container() {

  sudo docker run -d --name "${VERIFY_CONTAINER_NAME}" \
    -p "${VERIFY_PORT}:3000" \
    -v "$NEW_BUILD_DIR:/app" \
    -w /app \
    nginx:alpine \
    sh -c "npm install --omit=dev && PORT=3000 npx react-router-serve ./server/index.js"
}

function is_curl_verify_port_successful() {
  status=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:${VERIFY_PORT}")

  [ "$status" -eq 200 ]
}

function reload_nginx_container() {
  sudo docker exec "$NGINX_CONTAINER" nginx -s reload

  return $?
}

function clean_old_builds() {
  # -maxdepth 1: Only look at immediate subdirectories
  # -mindepth 1: Don't include the builds directory itself
  # -type d: Only directories
  # -printf '%T@ %p\n': Print timestamp and path
  echo "Cleaning old build directories..."
  find "$BUILDS_DIR" -maxdepth 1 -mindepth 1 -type d -printf '%T@ %p\n' |
    sort -nr |       # sort numerically by timestamp
    tail -n +3 |     # keep the last 2
    cut -d' ' -f2- | # remove the timestamp
    while read -r dir; do
      echo "Removing: $dir"
      rm -rf "$dir"
    done
}

info_msg() {
  echo -e "\e[1;34m$1\e[0m"
}

error_msg() {
  echo -e "\e[1;31m$1\e[0m"
}

success_msg() {
  echo -e "\e[1;32m$1\e[0m"
}

# -----------------------------------------------------------------------------
# Execution
# -----------------------------------------------------------------------------

info_msg "[ STEP 1 ]: Verify nginx container running."
if is_nginx_running; then
  echo "  - Production container running on port $PROD_PORT"
else
  error_msg "  - [ ERROR ]: Production container not running on port $PROD_PORT"
  exit 1
fi

echo
info_msg "[ STEP 2 ]: Run npm run build."
npm_run_build

echo
info_msg "[ STEP 3 ]: Verify build successful."
if is_build_successful; then
  success_msg "  [ SUCCESS ]: Build successful"
else
  error_msg "  [ ERROR ]: Build failed"
  echo "  - removing new build directory $NEW_BUILD_DIR"
  rm -rf "$NEW_BUILD_DIR"
  exit 1
fi

echo
info_msg "[ STEP 4 ]: Starting verification container..."
run_nginx_verify_container

# Verify new build
echo
info_msg "[ STEP 5 ]: Verifying new build with $VERIFY_CONTAINER_NAME by curling port $VERIFY_PORT"
attempt=1
max_attempts=30

while [ $attempt -le $max_attempts ]; do
  if is_curl_verify_port_successful; then
    success_msg "  [ SUCCESS ]: Verification successful"

    # stop verification container
    echo "  - Stopping verification container $VERIFY_CONTAINER_NAME"
    sudo docker stop "$VERIFY_CONTAINER_NAME"

    echo "  - Removing verification container $VERIFY_CONTAINER_NAME"
    sudo docker rm "$VERIFY_CONTAINER_NAME"

    echo "  - Backing up current symlink"
    mv "$BUILDS_DIR/current" "$BUILDS_DIR/current.backup"

    echo "  - Create new symlink called 'current' to new build directory"
    cd "${BUILDS_DIR}" && ln -s "build-${TIMESTAMP}" "current"

    echo
    info_msg "[ STEP 6 ]: Reloading nginx"
    if reload_nginx_container; then
      success_msg "  [ SUCCESS ]: Reloaded nginx"
    else
      error_msg "  [ ERROR ]: Failed to reload nginx."
      echo "  - Rolling back..."

      mv -f "$BUILDS_DIR/current.backup" "$BUILDS_DIR/current"
      reload_nginx_container
      rm -rf "$NEW_BUILD_DIR"
      exit 1
    fi

    echo
    info_msg "[ STEP 7 ]: Removing backup symlink"
    rm -rf "$BUILDS_DIR/current.backup"
    echo "  - removed $BUILDS_DIR/current.backup"

    echo
    info_msg "[ STEP 8 ]: Cleaning up old builds, keeping last 2"
    clean_old_builds

    echo
    success_msg "Too easy. Deployment successful! 🎉"
    echo
    exit 0
  fi
  echo "  - Waiting for verification.. (Attempt $attempt/$max_attempts)"
  sleep 2
  attempt=$((attempt + 1))
done

# Cleanup on failure
echo "Verification failed after $max_attempts attempts"
sudo docker stop "$VERIFY_CONTAINER_NAME"
sudo docker rm "$VERIFY_CONTAINER_NAME"
rm -rf "$NEW_BUILD_DIR"
exit 1
