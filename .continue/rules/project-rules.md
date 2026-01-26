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
- The custom Icons for Node-RED nodes is an npm package in [/node-red-contrib-custom-icons](../../node-red-contrib-custom-icons) directory.
- The custom nodes that use the API clients, and have the main logic of the HumAIne project that
  comes pre-packaged in the workflow editor, are an npm package in the [/node-red-contrib-humaine](../../node-red-contrib-humaine/) directory. This npm package is a custom node-RED nodes package written in TypeScript.

TODO: Complete project rules
