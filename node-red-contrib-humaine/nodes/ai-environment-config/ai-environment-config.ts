import { NodeInitializer, NodeAPI } from "node-red";
import { z } from "zod";
import { EnvironmentCatalogService, OpenAPI } from "../../haic_client";
import { envMetaSchema } from "../../haic_client/schemas/EnvMeta";
import { isHaicConfigNode } from "../shared/helpers";
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
        console.log("AiEnvironmentConfigNodeConstructor", config);
        RED.nodes.createNode(this, config);
        const node = this;
        // console.log("Node created", node);

        const haic_config_node = RED.nodes.getNode(config.haic_server);
        if (!isHaicConfigNode(haic_config_node)) {
            node.warn("HAIC Configuration not set!");
            return;
        }
        Object.assign(OpenAPI, haic_config_node.OpenAPI);

        node.on("input", async function (msg) {
            let response;
            try {
                response =
                    await EnvironmentCatalogService.listEnvsApiV1EnvsGet();
            } catch (error: any) {
                node.error(
                    "Failed to fetch AI configuration: " + error.message,
                );
                return;
            }

            try {
                envsMetaListSchema.parse(response);
                msg.payload = response;
            } catch (error: any) {
                node.error(
                    `Failed to parse AI configuration:${error.message} Response: ${JSON.stringify(response, null, 4)}`,
                );
                return;
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
