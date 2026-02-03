#!/usr/bin/env bash

export PATH=$PATH:/data/node_modules/.bin/
CUSTOM_NODE_HAIC_CLIENT_DIR="/data/node-red-contrib-humaine/haic_client"

modify_api_service_files() {
	cd $CUSTOM_NODE_HAIC_CLIENT_DIR/services || exit
	# Loop through all .ts files in the current directory
	for file in *.ts; do
		# Check if any .ts files exist
		[ -f "$file" ] || continue

		# Process the file in-place using sed
		sed -i.bak '/): CancelablePromise</ {
            s/): CancelablePromise</openAPI= OpenAPI): CancelablePromise</
        }; /return __request(OpenAPI, {/ {
            s/return __request(OpenAPI, {/return __request(openAPI, {/
        }' "$file"

		# Clean up backup file if no changes were made
		if cmp -s "$file.bak" "$file"; then
			rm "$file.bak"
		else
			rm "$file.bak"
		fi
	done
	prettier --write "*.ts"
	cd || exit
}

cd || exit
if [ -d "$CUSTOM_NODE_HAIC_CLIENT_DIR" ]; then
	rm -rf "$CUSTOM_NODE_HAIC_CLIENT_DIR"
fi
mkdir -p $CUSTOM_NODE_HAIC_CLIENT_DIR
npx openapi-typescript-codegen --input /data/openapi_integration/HAIC_OpenAPI.yaml --output $CUSTOM_NODE_HAIC_CLIENT_DIR --exportSchemas true
modify_api_service_files

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
