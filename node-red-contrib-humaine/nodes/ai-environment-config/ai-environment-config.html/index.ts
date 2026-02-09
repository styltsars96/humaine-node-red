import { EditorRED } from "node-red";
import { AiEnvironmentConfigEditorNodeProperties } from "./modules/types";
import { HaicConfigEditorNodeProperties } from "../../haic-config/haic-config.html/modules/types";
import { EnvsMetaList } from "../shared/types";

declare const RED: EditorRED;

type EnvsData = {
    envMetaList: EnvsMetaList;
    errorMsg: string | undefined;
};

RED.nodes.registerType<AiEnvironmentConfigEditorNodeProperties>(
    "ai-environment-config",
    {
        category: "HumAIne",
        color: "#58A69F",
        defaults: {
            name: { value: "" },
            haic_server: { value: "", type: "haic-config", required: true },
            aiEnvironmentId: { value: "", required: false },
            defaultApplication: { value: "", required: false },
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
            const localId = node.id;

            try {
                const haic_server = node.haic_server;
                let envMetaList: EnvsMetaList = []; // List to be populated from HAIC API
                let errorMsg = ""; // Error message to be displayed in the UI

                if (!haic_server) {
                    // Remove the other setup messages after the initial one:
                    $("#node-setup-message-aiEnvironmentId").remove();

                    console.warn(
                        "HAIC server must be set before Config options are available!",
                    );
                } else {
                    // Remove the setup message after HAIC server is selected
                    $("#node-setup-message-haic-server").remove();
                    const haic_config_node = RED.nodes.node(haic_server) as
                        | HaicConfigEditorNodeProperties
                        | undefined;
                    if (haic_config_node) {
                        try {
                            // Ask backend / runtime to get list of environments from HAIC API
                            const envsData: EnvsData = await $.getJSON(
                                `/node-red-contrib-humaine/ai-environment-config/${localId}/envs_list`,
                            );
                            if (envsData.errorMsg) {
                                errorMsg = envsData.errorMsg;
                            } else {
                                envMetaList = envsData.envMetaList;
                            }
                        } catch (error: any) {
                            errorMsg = error.message;
                            console.error(errorMsg);
                        }
                    } else {
                        errorMsg =
                            "Could not get configuration node required for the AI Environment Config options";
                        console.warn(errorMsg);
                    }
                }

                // Set up the AI Environments list
                const selectElement = document.getElementById(
                    "node-input-aiEnvironmentId",
                ) as HTMLSelectElement;

                // Store the currently selected value before clearing
                const currentSelectedValue = node.aiEnvironmentId || "";

                selectElement.innerHTML = "";

                // Add default option
                const defaultOption = document.createElement("option");
                defaultOption.value = "";
                if (envMetaList.length > 0) {
                    defaultOption.text = "Select an option";
                } else {
                    defaultOption.text =
                        "SET UP HAIC Server Configuration Correctly First! " +
                        errorMsg;
                }
                selectElement.appendChild(defaultOption);

                // Populate with dynamic options
                envMetaList.forEach((option) => {
                    const optionElement = document.createElement("option");
                    optionElement.value = option.id;
                    optionElement.text = option.name || option.id;
                    selectElement.appendChild(optionElement);
                });

                // Restore the previously selected value if it's still valid
                if (
                    currentSelectedValue &&
                    envMetaList.some((env) => env.id === currentSelectedValue)
                ) {
                    selectElement.value = currentSelectedValue;
                } else if (envMetaList.length === 0) {
                    // If there are no options and we had a previous selection,
                    // keep the error message option but don't auto-select anything
                    selectElement.value = "";
                    node.aiEnvironmentId = null;
                    $("#node-setup-message-aiEnvironmentId")
                        .children("p")
                        .text(
                            "No AI process environments have been found! Please set one up first!",
                        );
                }
            } catch (error) {
                console.error(
                    "Error populating AI Environment Config options dropdown:",
                    error,
                );
            }

            if (node.aiEnvironmentId) {
                // Remove the AI environment setup message if AI environment ID is selected!
                $("#node-setup-message-aiEnvironmentId").remove();
            }
        },
    },
);
