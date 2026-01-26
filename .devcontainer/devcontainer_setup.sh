#!/usr/bin/env bash

echo "Starting devcontainer setup..."

# Custom setup for all custom packages here
cd /data/node-red-contrib-custom-icons/ || exit
npm pack
cd /data/human_ai_benchmark_suite || exit
npm install
npm run build
npm pack
cd /data/kubeflow_pipelines_api || exit
npm install
npm run build
npm pack
# TODO: Add node-red-contrib-humaine once done
# cd /data/node-red-contrib-humaine  || exit
# npm install
# npm run build
# npm pack

cd /data/ || exit
npm install

# Dev dependencies outside node and npm:
curl -sS https://webi.sh/shfmt | sh
# shellcheck disable=SC1090
source ~/.config/envman/PATH.env

echo "Devcontainer setup completed successfully"
