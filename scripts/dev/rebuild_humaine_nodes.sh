#!/usr/bin/env bash

SCRIPT_DIR=$(dirname "$0")
NODE_NAME="node-red-contrib-humaine"
LOCAL_PACKAGE_TAG="1.0.0"
LOCAL_NODE_NAME=file:$NODE_NAME/$NODE_NAME-$LOCAL_PACKAGE_TAG.tgz

cd "$SCRIPT_DIR"/../.. || exit

build_package() {
	echo "Building $NODE_NAME..."
	cd $NODE_NAME || exit
	npm install
	yarn build
	npm pack
	cd .. || exit
	echo "Built $NODE_NAME!"
}

# Function to check if node is installed
# check_node_installed() {
# 	echo "Checking if $NODE_NAME is installed..."
# 	local result
# 	result=$(node-red admin list | grep -c "$NODE_NAME")

# 	if [ "$result" -eq 0 ]; then
# 		echo "Warning: $NODE_NAME does not appear to be installed"
# 		return 1
# 	else
# 		echo "Found $NODE_NAME installed"
# 		return 0
# 	fi
# }

uninstall_node() {
	echo "Uninstalling $NODE_NAME..."

	# First disable the node if it exists
	# echo "Disabling $NODE_NAME..."
	# node-red admin disable "$NODE_NAME"

	# # Then remove using npm through node-red admin
	# echo "Removing $NODE_NAME via node-red admin..."
	# if ! node-red admin remove "$NODE_NAME"; then
	# 	echo "Error: Failed to uninstall $NODE_NAME"
	# 	return 1
	# fi

	echo "Uninstalling $NODE_NAME via npm..."
	if ! npm uninstall "$NODE_NAME"; then
		echo "Error: Failed to uninstall $NODE_NAME"
		return 1
	fi

	echo "Successfully uninstalled $NODE_NAME"
	return 0
}

install_node() {
	echo "Installing $LOCAL_NODE_NAME..."
	if ! npm install $LOCAL_NODE_NAME; then

		echo "Error: Failed to install $LOCAL_NODE_NAME"
		return 1
	fi

	echo "Successfully installed $LOCAL_NODE_NAME"

	if ! pm2 restart node-red-dev-instance; then

		echo "Error: Failed to restart node-red-dev-instance"
		return 1
	fi

	echo "Successfully restarted node-red-dev-instance"
	return 0
}

# Main execution flow
main() {

	build_package

	# Check if node is currently installed
	# check_node_installed

	# Uninstall the node
	uninstall_node

	# Reinstall the node and restart node-red dev instance
	install_node

}

# main "$@"
main
