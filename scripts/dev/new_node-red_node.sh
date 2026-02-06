#!/usr/bin/env bash

SCRIPT_DIR=$(dirname "$0")

# THIS UTILITY IS ONLY TO BE RUN WITHIN THE DEV CONTAINER using the node-red-node-typescript-starter repository.

if [ $# -ne 2 ]; then
	echo "Usage: $0 <node_name> <node_type: 'config' or 'blank'>"
	exit 1
fi

cd "$SCRIPT_DIR/../../node-red-node-typescript-starter" || exit 1
yarn add-node "$1" "$2" --no-interactive
mkdir -p ../node-red-contrib-humaine/nodes/"$1"/
mv -f src/nodes/"$1"/* ../node-red-contrib-humaine/nodes/"$1"/
