# Creates two build directories and a symlink named "current" pointing to build-blue.
#- These directories will store our alternating builds.
source "$(dirname "$0")/config.bash"

mkdir -p "${HOME}/builds"
mkdir -p "${HOME}/builds/build_initial"

# Ensure correct ownership
chown -R ubuntu:ubuntu "${BUILDS_DIR}"

# Build the app for the first time
BUILD_PATH="${HOME}"/builds/build_initial npm run build --prefix "${PROJECT_DIR}"

# Create the initial "current" symlink
cd "${BUILDS_DIR}" && ln -s "build_initial" "current"
