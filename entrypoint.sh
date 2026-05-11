#!/bin/bash
# Entrypoint: copy default flows/settings into /data only on first run,
# then hand off to Node-RED via exec.

set -e

# Copy flows.json if not already present in the volume
if [ ! -f /data/flows.json ]; then
    cp /default-flows/flows.json /data/flows.json
    echo "[entrypoint] Copied default flows.json"
fi

# Copy settings.js (from example.settings.js template) if not already present
if [ ! -f /data/settings.js ]; then
    cp /default-flows/example.settings.js /data/settings.js
    echo "[entrypoint] Copied default settings.js"
fi

# Ensure jovyan user owns the data directory
chown -R 1000:1000 /data 2>/dev/null || true

# Execute whatever was passed as CMD
exec "$@"
