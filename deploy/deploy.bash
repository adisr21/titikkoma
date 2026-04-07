#!/bin/bash

# Exit segera jika ada command yang gagal
set -e

# Configuration
source "$(dirname "$0")/config.bash"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
NEW_BUILD_DIR="${BUILDS_DIR}/build-${TIMESTAMP}"

# -----------------------------------------------------------------------------
# Functions
# -----------------------------------------------------------------------------

function is_nginx_running() {
  # Cek apakah container nginx berjalan
  sudo docker ps --format '{{.Names}}' | grep -q "^${NGINX_CONTAINER}$"
}

function npm_run_build() {
  echo "  - Installing dependencies..."
  npm install --prefix "${PROJECT_DIR}"

  echo "  - Running build process..."
  npm run build --prefix "${PROJECT_DIR}"

  mkdir -p "$NEW_BUILD_DIR"
  # React Router v7/Remix membutuhkan seluruh folder build (client & server)
  cp -r "${PROJECT_DIR}/build" "$NEW_BUILD_DIR/"
  cp "${PROJECT_DIR}/package.json" "$NEW_BUILD_DIR/"
  # Jika menggunakan output standalone/server, pastikan file tersebut ikut
}

function is_build_successful() {
  # Sesuaikan path ini dengan output React Router Anda (biasanya build/server/index.js)
  [ -d "$NEW_BUILD_DIR/build" ] && [ -f "$NEW_BUILD_DIR/package.json" ]
}

function run_verify_container() {
  # GUNAKAN NODE IMAGE, bukan Nginx, karena Anda menjalankan 'npx react-router-serve'
  sudo docker run -d --name "${VERIFY_CONTAINER_NAME}" \
    -p "${VERIFY_PORT}:3000" \
    -v "$NEW_BUILD_DIR:/app" \
    -w /app \
    node:20-alpine \
    sh -c "npm install --omit=dev && PORT=3000 npx react-router-serve ./build/server/index.js"
}

function is_curl_verify_port_successful() {
  # Gunakan --fail agar curl return non-zero exit code jika 404/500
  curl -s --fail "http://localhost:${VERIFY_PORT}" > /dev/null
}

function reload_nginx_container() {
  sudo docker exec "$NGINX_CONTAINER" nginx -s reload
}

function clean_old_builds() {
  echo "Cleaning old build directories..."
  # Mencari direktori build-*, urutkan berdasarkan waktu, hapus selain 2 terbaru
  ls -dt "${BUILDS_DIR}"/build-* | tail -n +3 | xargs -r rm -rf
}

# UI Helpers
info_msg() { echo -e "\e[1;34m$1\e[0m"; }
error_msg() { echo -e "\e[1;31m$1\e[0m"; }
success_msg() { echo -e "\e[1;32m$1\e[0m"; }

# -----------------------------------------------------------------------------
# Execution
# -----------------------------------------------------------------------------

info_msg "[ STEP 1 ]: Verify nginx container running."
if is_nginx_running; then
  echo "  - Production container $NGINX_CONTAINER is up."
else
  error_msg "  - [ ERROR ]: Production container $NGINX_CONTAINER is not running."
  exit 1
fi

info_msg "[ STEP 2 ]: Run npm run build."
npm_run_build

info_msg "[ STEP 3 ]: Verify build successful."
if is_build_successful; then
  success_msg "  [ SUCCESS ]: Build artifacts found."
else
  error_msg "  [ ERROR ]: Build artifacts missing."
  rm -rf "$NEW_BUILD_DIR"
  exit 1
fi

info_msg "[ STEP 4 ]: Starting verification container (Node.js)..."
# Hapus container lama jika masih ada (karena crash sebelumnya)
sudo docker rm -f "${VERIFY_CONTAINER_NAME}" 2>/dev/null || true
run_verify_container

info_msg "[ STEP 5 ]: Verifying new build on port $VERIFY_PORT"
attempt=1
max_attempts=15 # 30 detik biasanya cukup

while [ $attempt -le $max_attempts ]; do
  if is_curl_verify_port_successful; then
    success_msg "  [ SUCCESS ]: Verification successful"

    sudo docker stop "${VERIFY_CONTAINER_NAME}"
    sudo docker rm "${VERIFY_CONTAINER_NAME}"

    echo "  - Updating symlink 'current'..."
    # ln -sfn membuat link baru secara atomik dan mengganti yang lama (-f)
    ln -sfn "$NEW_BUILD_DIR" "$BUILDS_DIR/current"

    info_msg "[ STEP 6 ]: Reloading nginx"
    if reload_nginx_container; then
      success_msg "  [ SUCCESS ]: Reloaded nginx"
    else
      error_msg "  [ ERROR ]: Failed to reload nginx."
      exit 1
    fi

    info_msg "[ STEP 7 ]: Cleaning up old builds"
    clean_old_builds

    success_msg "Deployment successful! 🎉"
    exit 0
  fi
  echo "  - Waiting for app to start... ($attempt/$max_attempts)"
  sleep 2
  attempt=$((attempt + 1))
done

# Cleanup on failure
error_msg "Verification failed!"
sudo docker stop "$VERIFY_CONTAINER_NAME" || true
sudo docker rm "$VERIFY_CONTAINER_NAME" || true
# Jangan hapus NEW_BUILD_DIR jika ingin debug manual, tapi jika di CI/CD sebaiknya hapus
# rm -rf "$NEW_BUILD_DIR"
exit 1