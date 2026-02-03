import { NodeInitializer, NodeAPI } from "node-red";
import { EnvironmentCatalogService, ApiError } from "../../haic_client";
import { isHaicConfigNode } from "../shared/helpers";
import {
    AiEnvironmentConfigNode,
    AiEnvironmentConfigNodeDef,
} from "./modules/types";
import { EnvsMetaList, EnvsMetaListSchema } from "./shared/types";

const nodeInit: NodeInitializer = (RED: NodeAPI): void => {
    function AiEnvironmentConfigNodeConstructor(
        this: AiEnvironmentConfigNode,
        config: AiEnvironmentConfigNodeDef,
    ) {
        // console.log("AiEnvironmentConfigNodeConstructor", config);
        RED.nodes.createNode(this, config);
        const node = this;
        const localId = node.id;
        node.aiEnvironmentId = config.aiEnvironmentId;
        // console.log("Node created", node);

        const haic_config_node = RED.nodes.getNode(config.haic_server);
        if (!isHaicConfigNode(haic_config_node)) {
            node.warn("HAIC Configuration not set!");
            return;
        }

        // Endpoint for the Editor side, to dynamically populate environments list.
        RED.httpAdmin.get(
            `/node-red-contrib-humaine/ai-environment-config/${localId}/envs_list`,
            RED.auth.needsPermission("nodes.read"),
            async function (req, res) {
                let result;
                let envMetaList: EnvsMetaList = [];
                let errorMsg: string | undefined;
                try {
                    result =
                        await EnvironmentCatalogService.listEnvsApiV1EnvsGet(
                            haic_config_node.OpenAPI,
                        );
                } catch (error: any) {
                    if (error instanceof ApiError) {
                        console.error(
                            `Failed to fetch AI configuration: URL ${error.url} STATUS ${error.status} REQUEST ${error.request} RESPONSE BODY ${error.body}`,
                        );
                    } else {
                        errorMsg =
                            "Failed to fetch AI configuration: " +
                            error.message;
                        node.error(errorMsg);
                    }
                }

                if (!errorMsg)
                    try {
                        envMetaList = EnvsMetaListSchema.parse(result);
                    } catch (error: any) {
                        errorMsg = `Failed to parse AI configuration:${error.message} Response: ${JSON.stringify(result, null, 4)}`;
                        node.error(errorMsg);
                    }

                res.json({
                    envMetaList: envMetaList,
                    errorMsg: errorMsg,
                });
            },
        );

        node.on("input", async function (msg) {
            let envId;
            let envBlocks;
            if (!node.aiEnvironmentId) {
                node.error(
                    "No AI Environment ID is Selected!!! Select the AI Process Environment to work on first!",
                );
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
    }

    RED.nodes.registerType(
        "ai-environment-config",
        AiEnvironmentConfigNodeConstructor,
    );
};

export = nodeInit;
