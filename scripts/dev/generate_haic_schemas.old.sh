#!/usr/bin/env bash

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
CUSTOM_NODE_DIR=$(realpath "$SCRIPT_DIR/../../node-red-contrib-humaine")
# SCHEMAS_DIR="$CUSTOM_NODE_DIR/schemas/haic_api"
SCHEMAS_DIR="schemas/haic_api"
# INPUTS_DIR=$(realpath "$SCRIPT_DIR/../../human_ai_benchmark_suite/models")
INPUTS_DIR="node_modules/human_ai_benchmark_suite/models"

cd "$CUSTOM_NODE_DIR" || exit 1
find "$SCHEMAS_DIR" -type f -delete # Remove old schemas

for FILE in "$INPUTS_DIR"/*.ts; do
	filename="${FILE##*/}"
	echo "Generating schema from file $FILE ..."
	npx ts-to-zod "$FILE" "$SCHEMAS_DIR/$filename" -k --skipValidation
	echo "Generated schema $SCHEMAS_DIR/$filename !"

done

echo "Done generating schemas"
