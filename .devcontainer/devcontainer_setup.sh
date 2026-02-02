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
cd /data/node-red-contrib-humaine || exit
npm install
yarn build
npm pack
rm -rf dist

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
# openapi-typescript-codegen
npm install -D openapi-typescript-codegen

# Have all new executables in path
# shellcheck disable=SC2016
echo 'export PATH=/usr/src/node-red/.local/bin/:/data/node_modules/.bin:$PATH' >>~/.bashrc

cd /data/ || exit
# node-red-node-typescript-starter to be able to quickly set up the scaffold for a typescript node-red node
git clone https://github.com/alexk111/node-red-node-typescript-starter.git
cd node-red-node-typescript-starter || exit
npm install yarn
git reset --hard
rm package-lock.json
yarn install

echo "Devcontainer setup completed successfully"
# shellcheck disable=SC1090
source ~/.bashrc
echo "Starting development Node-Red instance at 1881"
pm2 start node-red --name "node-red-dev-instance" -- -p 1881 --userDir /data
echo "Secondary dev node-red instance started! To view the logs of the node-red-dev-instance do 'pm2 logs node-red-dev-instance' and to restart 'pm2 restart node-red-dev-instance'!"
