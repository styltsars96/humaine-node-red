import { NodeInitializer, NodeAPI } from "node-red";
import {
    EnvironmentCatalogService,
    ApiError,
    OpenAPIConfig,
} from "../../haic_client";
import { isHaicConfigNode } from "../shared/helpers";
import {
    AiEnvironmentConfigNode,
    AiEnvironmentConfigNodeDef,
} from "./modules/types";
import { EnvsMetaList, EnvsMetaListSchema } from "./shared/types";

type EnvObject = {
    env: Record<string, any>;
    blocks: Record<string, any>;
};

const refreshHumAIneEnv = async (
    node: AiEnvironmentConfigNode,
    openApi: OpenAPIConfig,
): Promise<EnvObject | undefined> => {
    const flowContext = node.context().flow;
    try {
        const aiEnv = {
            env: await EnvironmentCatalogService.getEnvApiV1EnvsEnvIdGet(
                node.aiEnvironmentId,
                openApi,
            ),
            blocks: await EnvironmentCatalogService.getEnvBlocksApiV1EnvsEnvIdBlocksGet(
                node.aiEnvironmentId,
                openApi,
            ),
        };

        flowContext.set("HumAIne_AI_PROCESS_ENVIRONMENT", aiEnv);

        return aiEnv;
    } catch (error: any) {
        if (error instanceof ApiError) {
            node.error(
                `Failed to fetch AI configuration: URL ${error.url} STATUS ${error.status} REQUEST ${error.request} RESPONSE BODY ${error.body}`,
            );
        } else node.error("Failed to fetch AI configuration: " + error);
        return;
    }
};

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

        if (node.aiEnvironmentId) {
            // Save into the flow level, for usage by other nodes
            refreshHumAIneEnv(node, haic_config_node.OpenAPI).catch((error) => {
                node.error(
                    "Failed to fetch AI configuration on startup: " + error,
                );
            });
        } else {
            node.warn(
                "No AI Environment ID is selected yet!!! Select the AI Process Environment to work on first!",
            );
        }

        node.on("input", async function (msg) {
            if (!node.aiEnvironmentId) {
                node.error(
                    "No AI Environment ID is selected!!! Select the AI Process Environment to work on first!",
                );
                return;
            }
            // Trigger renewal of the HumAIne environment metadata, and emit it
            msg.payload = await refreshHumAIneEnv(
                node,
                haic_config_node.OpenAPI,
            );

            node.send(msg);
        });

        node.on("close", function () {
            //Cleanup
        });
    }

    RED.nodes.registerType(
        "ai-environment-config",
        AiEnvironmentConfigNodeConstructor,
    );
};

export = nodeInit;
