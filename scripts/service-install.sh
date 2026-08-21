#!/bin/bash

set -euo pipefail

# NOT `NODE_PATH` - that name belongs to Node itself (a module search path), and a machine
# that still exports it for legacy resolution would have it read here as an interpreter.
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

# The repo root, and the server half inside it. The server IS the service: it runs the API,
# owns the sqlite blog, and in production serves the built client and renders the server
# pages itself, so there is only ever one unit.
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SERVER_DIR="$ROOT/server"

# No build step for the server - Node runs the TypeScript source directly (>= 22.18, which
# is what package.json's engines field asks for), so this is `npm start` without the npm.
# WorkingDirectory is the SERVER directory, not the repo root: main.ts calls loadEnvFile()
# against the working directory, and CLIENT_DIR/SSR_ENTRY default to paths relative to it.
SERVICE_ENTRY="src/main.ts"

SERVICE_DIR="${SERVICE_DIR:-/etc/systemd/system}"
SERVICE_FILE="$SERVICE_DIR/${SERVICE_NAME}.service"

# The CLIENT half does have a build step, and production imports the SSR bundle at boot and
# serves the client bundle beside it - a missing one is a service that restart-loops. Say so
# here rather than in the log at 3am. `npm run build` writes both.
for artifact in application/dist/index.html application/dist-server/entry.server.js; do
  if [ ! -f "$ROOT/$artifact" ]; then
    echo "warning: $artifact is missing - run 'npm run build' before starting" >&2
  fi
done

# The unit pins NODE_ENV=production, and production refuses to boot without an admin key.
# Without this file that is the first thing the service does: exit, and try again forever.
if [ ! -f "$SERVER_DIR/.env" ]; then
  echo "warning: server/.env is missing - production will not boot without ADMIN_KEY in it" >&2
  echo "         copy server/.env.example and run 'npm run admin:key'" >&2
fi

# systemd does not create the directory it is told to log into.
mkdir -p "$SERVER_DIR/logs"

echo "> Installing systemd service (${SERVICE_FILE})..."

cat > "$SERVICE_FILE" <<EOF
[Unit]
Description=Nura Landing - site, blog and dashboard
After=network.target

[Service]
RestartSec=5
Restart=always
# Without this the server runs its DEVELOPMENT path: no SSR, and the devtools bridge attaches.
Environment=NODE_ENV=production
WorkingDirectory=$SERVER_DIR
# Quoted: systemd splits ExecStart on whitespace, and an interpreter installed under a path with
# a space in it (nvm on some setups, /opt installs) would otherwise be read as two arguments.
ExecStart="$NODE_BIN" $SERVICE_ENTRY

# append:, not file: - file: truncates on every start, and Restart=always means a crash loop
# would erase the very output that explains it. The logger's own NDJSON lands in logs/ too.
StandardOutput=append:$SERVER_DIR/logs/service_output.log
StandardError=append:$SERVER_DIR/logs/service_error.log

LimitNOFILE=1048576

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload

systemctl enable "$SERVICE_NAME"

echo "> Service Installed."
