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

# Dev dependencies outside of Node-RED's node and npm:
cd "$HOME" || exit
# shfmt
curl -sS https://webi.sh/shfmt | sh
# shellcheck disable=SC1090
source ~/.config/envman/PATH.env
echo 'source ~/.config/envman/PATH.env' >>~/.bashrc
echo 'alias shfmt="/usr/src/node-red/.local/bin/shfmt"' >>~/.bashrc
# make shellcheck executable within bash
wget "https://github.com/koalaman/shellcheck/releases/download/v0.11.0/shellcheck-v0.11.0.linux.x86_64.tar.xz"
tar -xf "shellcheck-v0.11.0.linux.x86_64.tar.xz"
cp shellcheck-v0.11.0/shellcheck /usr/src/node-red/.local/bin/
echo 'alias shellcheck="/usr/src/node-red/.local/bin/shellcheck"'

# Have all new executables in path
# shellcheck disable=SC2016
echo 'export PATH=/usr/src/node-red/.local/bin/:$PATH' >>~/.bashrc

cd /data/ || exit
# node-red-node-typescript-starter to be able to quickly set up the scaffold for a typescript node-red node
git clone https://github.com/alexk111/node-red-node-typescript-starter.git
cd node-red-node-typescript-starter || exit
npm install yarn
git reset --hard
rm package-lock.json
yarn install

echo "Devcontainer setup completed successfully"
