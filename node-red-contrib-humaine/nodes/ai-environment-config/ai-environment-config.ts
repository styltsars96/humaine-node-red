import { NodeInitializer, NodeAPI } from "node-red";
import { EnvironmentCatalogService, ApiError } from "../../haic_client";
import { isHaicConfigNode } from "../shared/helpers";
import {
    AiEnvironmentConfigNode,
    AiEnvironmentConfigNodeDef,
} from "./modules/types";

const nodeInit: NodeInitializer = (RED: NodeAPI): void => {
    function AiEnvironmentConfigNodeConstructor(
        this: AiEnvironmentConfigNode,
        config: AiEnvironmentConfigNodeDef,
    ) {
        // console.log("AiEnvironmentConfigNodeConstructor", config);
        RED.nodes.createNode(this, config);
        const node = this;
        node.aiEnvironmentId = config.aiEnvironmentId;
        // console.log("Node created", node);

        const haic_config_node = RED.nodes.getNode(config.haic_server);
        if (!isHaicConfigNode(haic_config_node)) {
            node.warn("HAIC Configuration not set!");
            return;
        }

        node.on("input", async function (msg) {
            let envId;
            let envBlocks;
            if (!node.aiEnvironmentId) {
                node.error("No AI Environment ID found or Selected!!!");
                return;
            }

            try {
                envId = await EnvironmentCatalogService.getEnvApiV1EnvsEnvIdGet(
                    node.aiEnvironmentId,
                    haic_config_node.OpenAPI,
                );
                envBlocks =
                    await EnvironmentCatalogService.getEnvBlocksApiV1EnvsEnvIdBlocksGet(
                        node.aiEnvironmentId,
                        haic_config_node.OpenAPI,
                    );
                msg.payload = {
                    env: envId,
                    blocks: envBlocks,
                };
            } catch (error: any) {
                if (error instanceof ApiError) {
                    node.error(
                        `Failed to fetch AI configuration: URL ${error.url} STATUS ${error.status} REQUEST ${error.request} RESPONSE BODY ${error.body}`,
                    );
                } else node.error("Failed to fetch AI configuration: " + error);
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
