import { NodeInitializer, NodeAPI } from "node-red";
import { z } from "zod";
import { EnvironmentCatalogService } from "haic_client";
import { envMetaSchema } from "haic_client/schemas/EnvMeta";
import { getRequestBody } from "../../haic_client/core/request";
import {
  AiEnvironmentConfigNode,
  AiEnvironmentConfigNodeDef,
} from "./modules/types";

const envsMetaListSchema = z.array(envMetaSchema);

const nodeInit: NodeInitializer = (RED: NodeAPI): void => {
  function AiEnvironmentConfigNodeConstructor(
    this: AiEnvironmentConfigNode,
    config: AiEnvironmentConfigNodeDef,
  ) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.on("input", async function (msg) {
      let response;
      try {
        response = await EnvironmentCatalogService.listEnvsApiV1EnvsGet();
      } catch (error: any) {
        node.error("Failed to fetch AI configuration: " + error.message);
      }

      try {
        envsMetaListSchema.parse(response);
        msg.payload = response;
      } catch (error: any) {
        node.error(
          `Failed to parse AI configuration:${error.message} Response: ${JSON.stringify(response, null, 4)}`,
        );
      }

      node.send(msg);
    });

    node.on("close", function () {
      // tidy up
    });
  }
  RED.nodes.registerType(
    "ai-environment-config",
    AiEnvironmentConfigNodeConstructor,
  );
};

export = nodeInit;
