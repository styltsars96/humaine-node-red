import { EditorRED } from "node-red";
import { AiEnvironmentConfigEditorNodeProperties } from "./modules/types";
import { HaicConfigNode } from "../../haic-config/modules/types";
import { ApiError, EnvironmentCatalogService } from "../../../haic_client";
import { envMetaSchema } from "../../../haic_client/schemas/EnvMeta";
import { z } from "zod";

declare const RED: EditorRED;

const envsMetaListSchema = z.array(envMetaSchema);
type envsMetaList = z.infer<typeof envsMetaListSchema>;

RED.nodes.registerType<AiEnvironmentConfigEditorNodeProperties>(
    "ai-environment-config",
    {
        category: "HumAIne HAIC Benchmark Suite",
        color: "#58A69F",
        defaults: {
            name: { value: "" },
            haic_server: { value: "", type: "haic-config", required: true },
            aiEnvironmentId: { value: "", required: true },
        },
        inputs: 1,
        outputs: 1,
        icon: "haic.svg",
        paletteLabel: "AI Environment Config",
        label: function () {
            return this.name || "AI Environment Config";
        },
        oneditprepare: async function () {
            const node = this;

            try {
                const haic_server = node.haic_server;
                let envMetaSchemaList: envsMetaList = []; // List to be populated from HAIC API
                console.log(haic_server); // TEST

                if (!haic_server) {
                    console.warn(
                        "HAIC server must be set before Config options are available",
                    );
                } else {
                    let response;
                    const haic_config_node = RED.nodes.node(haic_server) as
                        | HaicConfigNode
                        | undefined;
                    if (haic_config_node) {
                        console.log(haic_config_node);
                        console.log(haic_config_node.OpenAPI);
                        try {
                            response =
                                await EnvironmentCatalogService.listEnvsApiV1EnvsGet(
                                    haic_config_node.OpenAPI,
                                );
                        } catch (error: any) {
                            if (error instanceof ApiError) {
                                console.error(
                                    `Failed to fetch AI configuration: URL ${error.url} STATUS ${error.status} REQUEST ${error.request} RESPONSE BODY ${error.body}`,
                                );
                            } else
                                console.error(
                                    "Failed to fetch AI configuration: " +
                                        error,
                                );
                            return;
                        }

                        try {
                            envMetaSchemaList =
                                envsMetaListSchema.parse(response);
                        } catch (error: any) {
                            console.error(
                                `Failed to parse AI configuration:${error.message} Response: ${JSON.stringify(response, null, 4)}`,
                            );
                            return;
                        }
                    } else {
                        console.warn(
                            "Could not get configuration node required for the AI Environment Config options",
                        );
                    }
                }

                const selectElement = document.getElementById(
                    "node-input-aiEnvironmentId",
                );
                selectElement.innerHTML = "";

                // Add default option
                const defaultOption = document.createElement("option");
                defaultOption.value = "";
                if (envMetaSchemaList.length > 0) {
                    defaultOption.text = "Select an option";
                } else {
                    defaultOption.text =
                        "SET UP HAIC Server Configuration Correctly First!";
                }
                selectElement.appendChild(defaultOption);

                // Populate with dynamic options
                envMetaSchemaList.forEach((option) => {
                    const optionElement = document.createElement("option");
                    optionElement.value = option.id;
                    optionElement.text = option.name || option.id;
                    selectElement.appendChild(optionElement);
                });
            } catch (error) {
                console.error(
                    "Error populating AI Environment Config options dropdown:",
                    error,
                );
            }
        },
    },
);
