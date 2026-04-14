#!/usr/bin/env bash

set -Eeuo pipefail

APP_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
SERVICE_NAME="${SERVICE_NAME:-fustar-web}"
BRANCH="${BRANCH:-main}"

cd "$APP_DIR"

echo "==> Working directory: $APP_DIR"

if [[ ! -f ".env.local" ]]; then
  echo "Missing .env.local. Run 'bash edit-env.sh' first."
  exit 1
fi

if [[ -n "$(git status --porcelain --untracked-files=no)" ]]; then
  echo "Tracked local changes detected. Commit or stash them before deploying."
  git status --short
  exit 1
fi

echo "==> Pulling latest code from origin/$BRANCH"
git fetch origin "$BRANCH"
git pull --ff-only origin "$BRANCH"

echo "==> Installing dependencies"
npm ci

echo "==> Building production bundle"
npm run build

echo "==> Restarting $SERVICE_NAME"
sudo systemctl restart "$SERVICE_NAME"

echo "==> Waiting for service warm-up"
sleep 3

echo "==> Health check"
curl --fail --silent --show-error http://127.0.0.1:3000/api/health
echo

echo "==> Service status"
sudo systemctl status "$SERVICE_NAME" --no-pager
