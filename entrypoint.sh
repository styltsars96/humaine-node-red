#!/bin/bash

trap stop SIGINT SIGTERM

function stop() {
        kill $CHILD_PID
        wait $CHILD_PID
}

set -e

# Lazy-init /data from defaults if volume is empty (first run with fresh volume)
if [ ! -f /data/package.json ]; then
    echo "[entrypoint] Initializing /data from defaults..."
    cp -a /defaults/package.json /data/ 2>/dev/null || true
    cp -a /defaults/package-lock.json /data/ 2>/dev/null || true
    cp -a /defaults/node_modules /data/node_modules 2>/dev/null || true
    cp -a /defaults/flows.json /data/flows.json 2>/dev/null || true
    cp -a /defaults/settings.js /data/settings.js 2>/dev/null || true
    if [ -d /defaults/lib ]; then
        mkdir -p /data/lib && cp -a /defaults/lib/* /data/lib/ 2>/dev/null || true
    fi
    for f in .config.nodes.json .config.runtime.json .config.users.json; do
        if [ -f "/defaults/$f" ]; then
            cp -a "/defaults/$f" "/data/$f" 2>/dev/null || true
        fi
    done
    echo "[entrypoint] /data initialized from defaults."
fi

# Copy flows.json if not already present in the volume (fallback for non-empty volumes missing flows)
if [ ! -f /data/flows.json ]; then
    cp /defaults/flows.json /data/flows.json 2>/dev/null || true
    echo "[entrypoint] Copied default flows.json"
fi

# Copy settings.js if not already present in the volume (fallback for non-empty volumes missing settings)
if [ ! -f /data/settings.js ]; then
    cp /defaults/settings.js /data/settings.js 2>/dev/null || true
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
