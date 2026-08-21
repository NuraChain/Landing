#!/bin/bash

set -euo pipefail

# Resolve Node binary.
NODE_BIN="${NODE_BIN:-$(command -v node || true)}"

if [ -z "$NODE_BIN" ]; then
  echo "error: node binary not found (set NODE_BIN to override)" >&2
  exit 1
fi

if [ "$(id -u)" -ne 0 ]; then
  echo "error: writing the unit file needs root - re-run with sudo" >&2
  exit 1
fi

SERVICE_NAME="nura-landing"

# Repository root.
# This script is expected to live at:
#   /home/Landing/scripts/<this-file>.sh
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SERVER_DIR="$ROOT/server"

# Node runs the TypeScript source directly.
SERVICE_ENTRY="$SERVER_DIR/src/main.ts"

SERVICE_DIR="${SERVICE_DIR:-/etc/systemd/system}"
SERVICE_FILE="$SERVICE_DIR/${SERVICE_NAME}.service"

# Production client artifacts.
for artifact in \
  application/dist/index.html \
  application/dist-server/entry.server.js
do
  if [ ! -f "$ROOT/$artifact" ]; then
    echo "warning: $artifact is missing - run 'npm run build' before starting" >&2
  fi
done

# Production environment.
if [ ! -f "$SERVER_DIR/.env" ]; then
  echo "warning: server/.env is missing - production will not boot without ADMIN_KEY in it" >&2
  echo "         copy server/.env.example and run 'npm run admin:key'" >&2
fi

# systemd does not create log directories automatically.
mkdir -p "$SERVER_DIR/logs"

echo "> Installing systemd service (${SERVICE_FILE})..."
echo "> Repository: $ROOT"
echo "> Server:     $SERVER_DIR"
echo "> Node:       $NODE_BIN"
echo "> Entry:      $SERVICE_ENTRY"

cat > "$SERVICE_FILE" <<EOF
[Unit]
Description=Nura Landing - site, blog and dashboard
After=network.target

[Service]
Type=simple

Restart=always
RestartSec=5

Environment=NODE_ENV=production

# Keep the server as the working directory because main.ts loads
# .env and other relative paths from here.
WorkingDirectory=$SERVER_DIR

# Absolute path: the service no longer depends on the shell's current directory.
ExecStart=$NODE_BIN $SERVICE_ENTRY

StandardOutput=append:$SERVER_DIR/logs/service_output.log
StandardError=append:$SERVER_DIR/logs/service_error.log

LimitNOFILE=1048576

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable "$SERVICE_NAME"

echo "> Service installed successfully."
echo "> Unit: $SERVICE_FILE"

# If the service already exists, restart it immediately.
if systemctl is-active --quiet "$SERVICE_NAME"; then
  echo "> Restarting $SERVICE_NAME..."
  systemctl restart "$SERVICE_NAME"
else
  echo "> Starting $SERVICE_NAME..."
  systemctl start "$SERVICE_NAME"
fi

echo
systemctl status "$SERVICE_NAME" --no-pager