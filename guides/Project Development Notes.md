# Node-RED integration with HAIC and KubeFlow

## Quick setup for development using Dev Containers

Just open this project with vscode and "Rebuild and Reopen in Container". This will automatically install all required dependencies and set up the development environment.
**Note**: The devcontainer setup is not complete until the container **is restarted after the first launch**, so that Node-RED is properly set up and recognizes all the installed nodes.

## Manual setup and reconfiguration steps for development environment

- Check following subsections, follow the instructions!
<!-- - The `.env` file based on the example from the `backend` directory, has to be both in the `backend` and the project root directory!
  - Required for the `dev.docker-compose.yml` to work properly! -->
- Copy the `example.*` files in the `node-red` directory within the same place without the `example.` prefix!
  - Make sure to **comment out the functionGlobalContext section from settings.js**, then do the steps in the subsections using the compose file, and then uncomment it back and restart the Node-RED container!

For the integration, the OpenAPI files that are used to generate the API clients are kept in the repository as reference, in the `node-red/openapi_integration` directory.
THERE ARE TWO APPROACHES FOR API INTEGRATION, BASED ON OPENAPI SPECS, TO BE EVALUATED DURING IMPLEMENTATION, AND THE BEST ONE TO BE USED IN THE FINAL VERSION!

### Initialize Node-RED and run it properly manually

Steps to initialize the Node-RED container and run it properly, for development, in the current state:

1. Start the Node-RED container
2. Use bash in to the container and do the following to have the custom packages built and prepared for installation, including the custom icons package, and the custom clients for HAIC and KubeFlow:

    ```bash
    cd /data/node-red-contrib-custom-icons/
    npm pack
    cd /data/human_ai_benchmark_suite
    npm install
    npm run build
    npm pack
    cd /data/kubeflow_pipelines_api
    npm install
    npm run build
    npm pack
    ```

3. Use bash into the container and do the following to install dependencies of Node-RED

    ```bash
    cd /data/
    npm install
    ```

4. Restart the Node-RED container, after making sure that the `example.*` files are copied to the same directory without the `example.` prefix!

### Generate Client Code from OpenAPI Specifications (used in the new NR nodes written in TypeScript)

Make sure the development environment is properly set up.
Make sure the files in the [`openapi_integration`](../openapi_integration/) directory are up to date with the version of the API to be used.
Then run the following command from the root directory of the project (`/data/` when in dev container):

```bash
./scripts/dev/regenerate_ts_api_clients.sh
```

The files for the client code within teh custom node directory will be updated based on the changes in the openapi yaml files.
For each client TS library created, `core`, `models`, and `services` are generated to be used directly as an API client. The `schemas` are generated based on `models` by ts-to-zod!
The `models` have all the definitions of the API, while in order to perform validation with zod for any of the outputs of the API, we need to use the zod `schemas`.

### Generate Client Code from OpenAPI Specifications using Swagger Codegen (used for old NR Subflow-based nodes)

1. Use an external tool, [swagger-codegen CLI](https://github.com/swagger-api/swagger-codegen/releases) (get the latest v3.x.x version), to generate the client code for the APIs of HAIC and KubeFlow. This step is not part of the Node-RED container creation. Instead the generated client code is included in the repository. This step is only to be used in development. The type of output selected for swagger codegen is `typescript-axios`. The generated client code is included in the `human_ai_benchmark_suite` and `kubeflow_pipelines_api` directories.

    - In order to generate the client code, use the following command in the  directory where the codegen itself is installed:

    ```bash
    ./run-in-docker.sh generate -i HAIC_OpenAPI.yaml -l typescript-axios -o /gen/out/human_ai_benchmark_suite -DpackageName=human_ai_benchmark_suite
    ```

2. Make sure that for each of the generated, the `package.json` file has the correct version number, the same name as the corresponding directory, and that the `main` field points to the correct file.

3. Change the typescript compilation targets for the generated code, to be compatible with Node.js, and Node-RED by extension. To do that, copy the `tsconfig.template.json` from the `node-red` directory to the root of the generated client code directories, and rename it to `tsconfig.json`.

4. (Re-)Package and (re-)install the client code in the Node-RED container, if the API specifications are changed. If installation is already done, do `npm uninstall <package-name>` before re-installing each package.

    ```bash
    # IF INSTALLED, remove the old versions of the client code
    cd /data
    npm uninstall human_ai_benchmark_suite
    npm uninstall kubeflow_pipelines_api
    # Build and pack the client code for HAIC and KubeFlow
    cd /data/human_ai_benchmark_suite
    npm install
    npm run build
    npm pack
    cd /data/node-red-contrib-humaine
    cd /data
    npm install /data/human_ai_benchmark_suite/human_ai_benchmark_suite-1.0.0.tgz
    # Repeat similar procedure for KubeFlow
    cd /data/kubeflow_pipelines_api
    npm install
    npm run build
    npm pack
    cd /data
    npm install /data/kubeflow_pipelines_api/kubeflow_pipelines_api-2.4.1.tgz
    ```

    NOTE: CAREFUL TO HAVE THE CORRECT VERSION NUMBERS IN THE CORRESPONDING package.json file and the COMMANDS!

## Notes for Node-RED usage of TypeScript

Here are the usage options:

1. Using `node-red-contrib-typescript-node`
This library allows you to write Node-RED nodes using TypeScript. It provides a wrapper around Node-RED's core functionality, enabling you to extend the `Node` class and use TypeScript type definitions. However, it is still in its early stages, so caution is advised when using it.

2. `node-red-node-typescript-starter` Template
This GitHub repository offers a quick-start template for creating Node-RED node sets in TypeScript. It includes a structured project setup with TypeScript configuration files (`tsconfig.json`) and build tools (e.g., Rollup). You can scaffold new nodes, develop them in TypeScript, and compile them for use in Node-RED. This approach supports incremental builds and testing during development.

3. `node-red-contrib-typescript-template`
This project provides another template for creating Node-RED nodes in TypeScript. It includes example nodes demonstrating how to set up TypeScript-based custom nodes with proper integration into Node-RED.

4. Manual Compilation and Integration.
If you prefer not to use templates or libraries, you can manually create custom nodes by writing them in TypeScript, compiling them into JavaScript using tools like `tsc`, and packaging them as Node.js modules for Node-RED. This method requires creating both runtime (`*.js`) and editor (`*.html`) files for each node.

## Install any local custom npm package into Node-RED

The custom icons package is used as a rudimentary example. All is done by using bash within the Node-RED container:

```bash
cd /data/node-red-contrib-custom-icons/
npm pack
cd /data/
npm install /data/node-red-contrib-custom-icons/node-red-contrib-custom-icons-1.0.0.tgz
```

## Create the scaffolding for a new Node-RED node written in TypeScript quickly

Create the new node easily **within the devcontainer** environment by just running:

```bash
cd /data/
./scripts/dev/new_node-red_node.sh <node_name> <node_type 'blank' or 'config'>
```

Then, **in order to include the new node in the editor, it is required the the following section is updated accordingly in the `package.json` file**. Example:

```json
  "node-red": {
    "nodes": {
      "transform-text": "./dist/nodes/transform-text/transform-text.js",
      "test-node-humaine": "./dist/nodes/test-node-humaine/test-node-humaine.js",
      "test-node-humaine-config": "./dist/nodes/test-node-humaine-config/test-node-humaine-config.js",
      "ai-environment-config-node": "./dist/nodes/ai-environment-config-node/ai-environment-config-node.js",
      "ai-environment-config": "./dist/nodes/ai-environment-config/ai-environment-config.js",
      "haic-config": "./dist/nodes/haic-config/haic-config.js"
    }
  },
```

## Use the new custom Node-RED node written in TypeScript

And in order to use it, remove the previous package, and do the following:

```bash
cd node-red-contrib-humaine
npm install
yarn build
npm pack
cd ..
npm install file:node-red-contrib-humaine/node-red-contrib-humaine-1.0.0.tgz # The specific version
```

### Build, install and use the custom nodes immediately in dev container

In the dev container setup, there is a secondary instance of node-red running via pm2, available on port 1881.
To immediately use the custom node, a.k.a. the `node-red-contrib-humaine` package, along with anything else that comes with it,
in the Node-RED flow editor, just run from a bash shell within the dev container:

```bash
./scripts/dev/rebuild_humaine_nodes.sh
```

While the main instance of node-red is running on port 1880 will not have any changes unless the whole container is restarted,
the secondary instance, named node-red-dev-instance in pm2, on port 1881, will have all changes available.
Just make sure that changes to flows do not happen in both instances at the same time, use only one instance at a time!

TODO: How to test nodes individually without needing the Node-RED editor? (using `__tests__` as example). Requires jest
