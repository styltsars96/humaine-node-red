import { NodeInitializer, NodeAPI } from "node-red";
import {
  AiEnvironmentConfigNode,
  AiEnvironmentConfigNodeDef,
} from "./modules/types";

const nodeInit: NodeInitializer = (RED: NodeAPI): void => {
  function AiEnvironmentConfigNodeConstructor(
    this: AiEnvironmentConfigNode,
    config: AiEnvironmentConfigNodeDef,
  ) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.on("input", async function (msg) {
      try {
        // TODO: CHANGE COMPLETELY, this is only a scaffold
        // Get API credentials from environment
        const apiKey = RED.settings.get("TEST_API_KEY") || process.env.API_KEY;
        const baseUrl =
          RED.settings.get("TEST_API_BASE_URL") || "https://api.example.com";

        // Make authenticated request to get AI configuration
        const response = await fetch(`${baseUrl}/ai/config`, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        });

        const configData = await response.json();

        // Store parameters in flow context
        node.context().flow.set("aiParameters", configData);

        msg.payload = configData;
        node.send(msg);
      } catch (error: any) {
        node.error("Failed to fetch AI configuration: " + error.message);
      }
    });
  }
  RED.nodes.registerType(
    "ai-environment-config",
    AiEnvironmentConfigNodeConstructor,
  );
};

export = nodeInit;
