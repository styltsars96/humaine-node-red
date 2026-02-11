import { NodeInitializer, NodeAPI } from "node-red";
import {
    EnvironmentCatalogService,
    ApiError,
    OpenAPIConfig,
    ConfigurationService,
} from "../../haic_client";
import { isHaicConfigNode } from "../shared/helpers";
import {
    AiEnvironmentConfigNode,
    AiEnvironmentConfigNodeDef,
} from "./modules/types";
import {
    EnvsMetaList,
    EnvsMetaListSchema,
    EvaluationConfigList,
    EvaluationConfigListSchema,
    AppConfigsRefreshResult,
    AppConfigContextData,
} from "./shared/types";
import {
    HAICFlowEnvironmentData,
    HaicLoggerSelectionOptions,
    HumAIneEnvironmentData,
    IntraNodeMsg,
} from "../shared/types";

const REFRESH_MSG_TIMEOUT_MS = 3000;

// Refresh the AI Environment Data
const refreshHumAIneEnv = async (
    node: AiEnvironmentConfigNode,
    openApi: OpenAPIConfig,
): Promise<HumAIneEnvironmentData | undefined> => {
    const flowContext = node.context().flow;
    try {
        const [envResult, blocksResult] = await Promise.all([
            EnvironmentCatalogService.getEnvApiV1EnvsEnvIdGet(
                node.aiEnvironmentId,
                openApi,
            ),
            EnvironmentCatalogService.getEnvBlocksApiV1EnvsEnvIdBlocksGet(
                node.aiEnvironmentId,
                openApi,
            ),
        ]);

        const aiEnv: HumAIneEnvironmentData = {
            env: envResult,
            blocks: blocksResult,
        };

        flowContext.set("HumAIne_AI_PROCESS_ENVIRONMENT", aiEnv);
        node.status({
            fill: "green",
            shape: "dot",
            text: `JUST UPDATED ${node.aiEnvironmentId} Environment for this flow!`,
        });
        setTimeout(() => {
            node.status({
                fill: "green",
                shape: "dot",
                text: `AI Process Environment: ${node.aiEnvironmentId}`,
            });
        }, REFRESH_MSG_TIMEOUT_MS);
        return aiEnv;
    } catch (error: any) {
        if (error instanceof ApiError) {
            node.error(
                `Failed to fetch AI configuration: URL ${error.url} STATUS ${error.status} REQUEST ${error.request} RESPONSE BODY ${error.body}`,
            );
        } else {
            node.error("Failed to fetch AI configuration: " + error);
        }
        node.status({
            fill: "red",
            shape: "ring",
            text: `Failed to fetch env metadata for ${node.aiEnvironmentId}`,
        });
        return;
    }
};

// Refresh the Application Configurations
const refreshAppConfigs = async (
    node: AiEnvironmentConfigNode,
    openApi: OpenAPIConfig,
): Promise<AppConfigsRefreshResult> => {
    let result;
    let appConfigsList: EvaluationConfigList = [];
    let errorMsg: string | undefined;

    try {
        result =
            await ConfigurationService.getAllConfigurationsApiV1ConfigurationListGet(
                openApi,
            );
    } catch (error: any) {
        if (error instanceof ApiError) {
            errorMsg = `Failed to fetch App Configs: URL ${error.url} STATUS ${error.status} REQUEST ${error.request} RESPONSE BODY ${error.body}`;
            console.error(errorMsg);
        } else {
            errorMsg = "Failed to fetch  App Configs: " + error.message;
            node.error(errorMsg);
        }
    }

    if (!errorMsg) {
        try {
            appConfigsList = EvaluationConfigListSchema.parse(result);
        } catch (error: any) {
            errorMsg = `Failed to parse AI configuration: ${error.message} Response: ${JSON.stringify(result, null, 4)}`;
            node.error(errorMsg);
        }
    }

    if (!errorMsg) {
        const appConfigsMap: AppConfigContextData = appConfigsList.reduce(
            (acc, config) => {
                if (config.id) {
                    acc[config.id] = config;
                }
                return acc;
            },
            {} as AppConfigContextData,
        );
        node.context().flow.set("HumAIne_APP_CONFIGS", appConfigsMap);
    }

    return {
        appConfigsList: appConfigsList,
        errorMsg: errorMsg,
    };
};

const fetchHaicLoggerSelectionOptions = async (
    node: AiEnvironmentConfigNode,
    selected_model: string | null = null,
): Promise<IntraNodeMsg<HaicLoggerSelectionOptions>> => {
    let errorMsg: string = "";
    const payload: HaicLoggerSelectionOptions = {
        applications: [],
        models: [],
        actions: [],
    };
    const flowContext = node.context().flow;

    const appConfigs = flowContext.get("HumAIne_APP_CONFIGS") as
        | AppConfigContextData
        | undefined;
    if (!appConfigs) {
        errorMsg += " HumAIne HAIC APP CONFIGS are NOT SET! ";
    } else {
        payload.applications = Object.entries(appConfigs).map(
            ([idStr, config]) => ({
                id: String(config.id ?? Number(idStr)),
                text: `${config.application_name} (${String(config.id ?? Number(idStr))})`,
            }),
        );
    }

    const aiEnv = flowContext.get("HumAIne_AI_PROCESS_ENVIRONMENT") as
        | HumAIneEnvironmentData
        | undefined;
    if (!aiEnv) {
        errorMsg += " AI Process Environment is NOT SET! ";
    } else {
        const aiModels = aiEnv.env.agents;

        payload.models = aiModels.map((modelEntry) => {
            return {
                id: modelEntry.id,
                text: `${modelEntry.label || ""} ${modelEntry.id} ${modelEntry.model || ""}`,
            };
        });

        if (!selected_model) {
            payload.actions = [
                {
                    id: "",
                    text: "SELECT MODEL FIRST",
                },
            ];
        } else {
            const modelDef = aiModels.find((item) => item.id == selected_model);
            if (modelDef) {
                if (modelDef.affordances.length === 0) {
                    errorMsg += ` Model ${selected_model} has no affordances!`;
                } else {
                    payload.actions = modelDef.affordances.map((affordance) => {
                        return { id: affordance, text: affordance };
                    });
                }
            } else
                errorMsg += ` Model definition ${selected_model} not found in environment! `;
        }
    }

    return {
        payload: payload,
        errorMsg: errorMsg,
    };
};

const nodeInit: NodeInitializer = (RED: NodeAPI): void => {
    function AiEnvironmentConfigNodeConstructor(
        this: AiEnvironmentConfigNode,
        config: AiEnvironmentConfigNodeDef,
    ) {
        RED.nodes.createNode(this, config);
        const node = this;
        const localId = node.id;
        const localFlowId = node.z;

        node.aiEnvironmentId = config.aiEnvironmentId;
        if (config.defaultApplication)
            node.defaultApplication = config.defaultApplication;

        const haic_config_node = RED.nodes.getNode(config.haic_server);
        const flowContext = node.context().flow;
        if (!isHaicConfigNode(haic_config_node)) {
            node.warn("HAIC Configuration not set!");
            return;
        }

        if (flowContext.get("HumAIne_HAIC_ENVIRONMENT")) {
            node.status({
                fill: "red",
                shape: "ring",
                text: "DUPLICATE CONFIG IN THE FLOW! REMOVE!",
            });
            node.error(
                "There already exists an AI Environment Configuration Node in this flow! There can be only one per flow!",
            );
            return;
        }

        // Endpoint for the Editor side, to dynamically populate AI Process Environments list.
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
                        errorMsg = `Failed to fetch AI configuration: URL ${error.url} STATUS ${error.status} REQUEST ${error.request} RESPONSE BODY ${error.body}`;
                        console.error(errorMsg);
                    } else {
                        errorMsg =
                            "Failed to fetch AI configuration: " +
                            error.message;
                        node.error(errorMsg);
                    }
                }

                if (!errorMsg) {
                    try {
                        envMetaList = EnvsMetaListSchema.parse(result);
                    } catch (error: any) {
                        errorMsg = `Failed to parse AI configuration: ${error.message} Response: ${JSON.stringify(result, null, 4)}`;
                        node.error(errorMsg);
                    }
                }

                res.json({
                    envMetaList: envMetaList,
                    errorMsg: errorMsg,
                });
            },
        );

        // Endpoint for the Editor side, to dynamically populate HAIC Application Configurations list.
        RED.httpAdmin.get(
            `/node-red-contrib-humaine/ai-environment-config/${localId}/applications_list_refresh`,
            RED.auth.needsPermission("nodes.read"),
            async function (req, res) {
                const result = await refreshAppConfigs(
                    node,
                    haic_config_node.OpenAPI,
                );

                res.json(result);
            },
        );

        if (!node.aiEnvironmentId) {
            node.status({
                fill: "red",
                shape: "dot",
                text: "No AI Environment ID is selected yet!",
            });
            return;
        }

        // Save the config node IDs, this and the API, in the flow context, for usage by other nodes
        const humaineHaicEnvironment: HAICFlowEnvironmentData = {
            haicApiNodeId: config.haic_server,
            haicEnvironmentNodeId: node.id,
        };
        flowContext.set("HumAIne_HAIC_ENVIRONMENT", humaineHaicEnvironment);

        // Save AI environment into the flow context, for usage by other nodes
        refreshHumAIneEnv(node, haic_config_node.OpenAPI).catch((error) => {
            node.error("Failed to fetch AI configuration on startup: " + error);
        });
        // Save application configs in the flow context, for usage by other nodes
        refreshAppConfigs(node, haic_config_node.OpenAPI).catch((error) => {
            node.error(
                "Failed to fetch HAIC App configs list on startup: " + error,
            );
        });

        node.on("input", async function (msg) {
            if (!node.aiEnvironmentId) {
                node.error(
                    "No AI Environment ID is selected!!! Select the AI Process Environment to work on first!",
                );
                node.status({
                    fill: "red",
                    shape: "dot",
                    text: "No AI Environment ID is selected yet!",
                });
                return;
            }

            // Trigger renewal of the HumAIne environment metadata, and emit the metadata
            const [humaineEnvResult, appConfigsResult] = await Promise.all([
                refreshHumAIneEnv(node, haic_config_node.OpenAPI),
                refreshAppConfigs(node, haic_config_node.OpenAPI),
            ]);

            msg.payload = humaineEnvResult;
            if (!appConfigsResult.errorMsg) {
                msg.payload["appConfigsList"] = appConfigsResult.appConfigsList;
            }

            node.send(msg);
        });

        // Endpoints for the HAIC Logger Options
        RED.httpAdmin.get(
            `/node-red-contrib-humaine/flows/${localFlowId}/haic-logger/selection_options`,
            RED.auth.needsPermission("nodes.read"),
            async function (req, res) {
                const result = await fetchHaicLoggerSelectionOptions(node);
                res.json(result);
            },
        );
        RED.httpAdmin.post(
            `/node-red-contrib-humaine/flows/${localFlowId}/haic-logger/selection_options`,
            RED.auth.needsPermission("nodes.read"),
            async function (req, res) {
                const selectedModel = req.body.selectedModel ?? "";
                const result = await fetchHaicLoggerSelectionOptions(
                    node,
                    selectedModel,
                );
                res.json(result);
            },
        );
        // NOTE: If other nodes need some internal usage endpoint for setups on the frontend/editor, add them here

        node.on("close", function () {
            // Cleanup
            flowContext.set("HumAIne_HAIC_ENVIRONMENT", undefined);
            flowContext.set("HumAIne_AI_PROCESS_ENVIRONMENT", undefined);
            flowContext.set("HumAIne_APP_CONFIGS", undefined);
        });
    }

    RED.nodes.registerType(
        "ai-environment-config",
        AiEnvironmentConfigNodeConstructor,
    );
};

export = nodeInit;
