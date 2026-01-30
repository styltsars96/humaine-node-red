# Project Architecture

This project revolves around creating the Node-RED container for the HumAIne project.
The main goal is to provide a containerized environment that integrates with HAIC (Human-AI-Collaboration) component and KubeFlow.
The Node-RED has to be ready to integrate with both components, as well as third-party components,
and to be able to run flows that use the APIs of both components.
The whole point of Node-RED is to provide a visual programming environment for integrating different components,
and create and edit Workflows, that use these APIs, along with other arbitrary integrations that AI devs are able to subsequently use.

In order to do that, there are the following parts:

- API clients for the HAIC component and KubeFlow. These are auto-generated and included in the project as npm packages:
  - HAIC client is in [/human_ai_benchmark_suite](../../human_ai_benchmark_suite/) directory.
  - KubeFlow client is in [/kubeflow_pipelines_api](../../kubeflow_pipelines_api/) directory.
  The above are becoming deprecated, however, as the project moves into a TypeScript-native implementation, and these packages are required for the old Node-RED nodes which are subflows.
- The custom Icons for Node-RED nodes is an npm package in [/node-red-contrib-custom-icons](../../node-red-contrib-custom-icons) directory.
- The custom nodes that use the API clients, and have the main logic of the HumAIne project that
  comes pre-packaged in the workflow editor, are an npm package in the [/node-red-contrib-humaine](../../node-red-contrib-humaine/) directory.
  This npm package is a custom node-RED nodes package written in TypeScript. Aside from the nodes, any utility the nodes require, as well as the API client library are all within this package.
  More specifically:
  - The [nodes directory](../../node-red-contrib-humaine/nodes/) has the implementation of the different nodes, as well as the code [shared](../../node-red-contrib-humaine/nodes/shared/) between nodes.
    The other sub-directories aside from `shared` are nodes. For each of the others there is:
    - A TypeScript file with the same name as the node, which is the "main" logic.
    - The `shared` code between the editor side and runtime side of the node.
    - A `name.html` directory which contains the code for the editor side of the node. This has the main logic in `index.ts`, with html files for the editor UI.
    - Other directories can be `icons` and `modules` used by the runtime side.
  - The `name_client` has the API client library generated from the OpenAPI spec, along with the zod `schemas` used for validating based on the types that are defined in `models`.

TODO: Complete project rules
