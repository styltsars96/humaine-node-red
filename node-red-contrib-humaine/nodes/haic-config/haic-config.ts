import { NodeInitializer } from "node-red";
import { HaicConfigNode, HaicConfigNodeDef } from "./modules/types";
import { OpenAPI } from "../../haic_client/core/OpenAPI";

const nodeInit: NodeInitializer = (RED): void => {
  function HaicConfigNodeConstructor(
    this: HaicConfigNode,
    config: HaicConfigNodeDef,
  ): void {
    RED.nodes.createNode(this, config);

    // Set the OpenAPI configuration based on node settings
    if (config.baseUrl) {
      OpenAPI.BASE = config.baseUrl;
    }
    if (config.token) {
      OpenAPI.TOKEN = config.token;
    }
    if (config.username && config.password) {
      OpenAPI.USERNAME = config.username;
      OpenAPI.PASSWORD = config.password;
    }
    if (config.withCredentials !== undefined) {
      OpenAPI.WITH_CREDENTIALS = config.withCredentials;
    }
    if (config.headers !== undefined && config.headers !== "") {
      try {
        // Try to parse headers as JSON
        const parsedHeaders = JSON.parse(config.headers);
        OpenAPI.HEADERS = parsedHeaders;
      } catch (e) {
        // If parsing fails, set HEADERS to undefined
        OpenAPI.HEADERS = undefined;
      }
    }
  }

  RED.nodes.registerType("haic-config", HaicConfigNodeConstructor);
};

export = nodeInit;
