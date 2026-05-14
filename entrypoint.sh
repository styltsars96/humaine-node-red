#!/bin/bash

trap stop SIGINT SIGTERM

function stop() {
        kill $CHILD_PID
        wait $CHILD_PID
}

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

# Sync working flows to jovyan home (needs -u to avoid overwriting the working version with the base version on restart of container)
cp -u /data/flows.json /home/jovyan/flows.json 2>/dev/null || true

# Ensure jovyan user owns the data directory and home
chown -R 1000:1000 /data 2>/dev/null || true
chown -R 1000:1000 /home/jovyan 2>/dev/null || true

/usr/local/bin/node $NODEOPTIONS /usr/src/node-red/node_modules/node-red/red.js -p 8888 --userDir /data $FLOWS &

CHILD_PID="$!"

wait "${CHILD_PID}"
