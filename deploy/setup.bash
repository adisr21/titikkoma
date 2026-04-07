# Creates two build directories and a symlink named "current" pointing to build-blue.
#- These directories will store our alternating builds.
source "$(dirname "$0")/config.bash"

mkdir -p "${HOME}/builds"
mkdir -p "${HOME}/builds/build_initial"

chown -R ubuntu:ubuntu "${BUILDS_DIR}"

npm install --prefix "${PROJECT_DIR}"

export PATH=$PATH:${PROJECT_DIR}/node_modules/.bin

BUILD_PATH="${HOME}/builds/build_initial" npm run build --prefix "${PROJECT_DIR}"

cd "${BUILDS_DIR}" && ln -sfn "build_initial" "current"