#!/usr/bin/env bash

CUSTOM_NODE_HAIC_CLIENT_DIR="/data/node-red-contrib-humaine/haic_client"

cd || exit
if [ -d "$CUSTOM_NODE_HAIC_CLIENT_DIR" ]; then
	rm -rf "$CUSTOM_NODE_HAIC_CLIENT_DIR"
fi
mkdir -p $CUSTOM_NODE_HAIC_CLIENT_DIR
npx openapi-typescript-codegen --input /data/openapi_integration/HAIC_OpenAPI.yaml --output $CUSTOM_NODE_HAIC_CLIENT_DIR --exportSchemas true

# TODO add whatever else is required to be generated!

# Generate zod schemas from the generated types

cd $CUSTOM_NODE_HAIC_CLIENT_DIR || exit
mkdir -p $CUSTOM_NODE_HAIC_CLIENT_DIR/schemas
for FILE in models/*.ts; do
	filename="${FILE##*/}"
	echo "Generating schema from file $FILE ..."
	npx ts-to-zod "$FILE" "schemas/$filename" -k --skipValidation
	echo "Generated schema schemas/$filename !"
done

# TODO add whatever else is required to be generated!
