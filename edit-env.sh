#!/usr/bin/env bash

set -Eeuo pipefail

APP_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$APP_DIR/.env.local"

pick_editor() {
  if [[ -n "${EDITOR:-}" ]]; then
    local editor_bin="${EDITOR%% *}"
    if command -v "$editor_bin" >/dev/null 2>&1; then
      echo "$EDITOR"
      return 0
    fi
  fi

  for candidate in nano micro vim vi; do
    if command -v "$candidate" >/dev/null 2>&1; then
      echo "$candidate"
      return 0
    fi
  done

  return 1
}

mkdir -p "$APP_DIR"

if [[ ! -f "$ENV_FILE" ]]; then
  cat > "$ENV_FILE" <<'EOF'
OPENROUTER_API_KEY=
OPENROUTER_MODEL=z-ai/glm-4.7-flash
NEXT_PUBLIC_SITE_URL=https://fustar.top
EOF
  echo "Created $ENV_FILE from template."
fi

BACKUP_FILE="${ENV_FILE}.bak.$(date +%Y%m%d-%H%M%S)"
cp "$ENV_FILE" "$BACKUP_FILE"
echo "Backup saved to $BACKUP_FILE"

EDITOR_CMD="$(pick_editor)" || {
  echo "No editor found. Install nano with: sudo dnf install -y nano"
  exit 1
}

echo "Opening $ENV_FILE with: $EDITOR_CMD"
echo "Save and exit when you're done."

exec $EDITOR_CMD "$ENV_FILE"
