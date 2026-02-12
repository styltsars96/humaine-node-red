import { EditorRED } from "node-red";
import { HaicLoggerEditorNodeProperties } from "./modules/types";
import { IntraNodeMsg, HaicLoggerSelectionOptions } from "../../shared/types";
import { populateSelectWithOptions } from "../../shared/helpers";

declare const RED: EditorRED;

RED.nodes.registerType<HaicLoggerEditorNodeProperties>("haic-logger", {
    category: "HumAIne",
    color: "#58A69F",
    defaults: {
        name: { value: "" },
        application: { value: "", required: false },
        model: { value: "" },
        affordance_action: { value: "" },
        sessionIdJsonPath: { value: "$payload.session_id", required: false },
        // interactionIdJsonPath: { value: "$interactionId", required: false },
    },
    inputs: 1,
    outputs: 1,
    icon: "haic.svg",
    paletteLabel: "HAIC Logger",
    label: function () {
        if (this.model && this.affordance_action) {
            return (
                this.name || `${this.model}  ${this.affordance_action} Logger`
            );
        }
        return this.name || "HAIC Logger";
    },
    oneditprepare: async function () {
        const node = this;
        const localId = node.id;
        const localFlowId = node.z;

        let selectionOptions: HaicLoggerSelectionOptions = {
            actions: [],
            applications: [],
            models: [],
        };
        let errorMsg = ""; // Error message to be displayed in the editor UI
        let promptMsg = ""; // Simple message to be displayed in the editor UI

        // Store the currently selected values before clearing
        const currentSelectedAction = node.affordance_action;
        const currentSelectedModel = node.model;
        const currentSelectedApplication = node.application;

        const actionSelectElement = document.getElementById(
            "node-input-affordance_action",
        ) as HTMLSelectElement;
        const modelSelectElement = document.getElementById(
            "node-input-model",
        ) as HTMLSelectElement;
        const applicationSelectElement = document.getElementById(
            "node-input-application",
        ) as HTMLSelectElement;

        // Helper function to fetch options (GET or POST)
        const fetchSelectionOptions = async (selectedModel?: string) => {
            try {
                let selectionOptionsResponse: IntraNodeMsg<HaicLoggerSelectionOptions>;

                if (selectedModel) {
                    selectionOptionsResponse = (await $.ajax({
                        url: `/node-red-contrib-humaine/flows/${localFlowId}/haic-logger/selection_options`,
                        method: "POST",
                        contentType: "application/json",
                        data: JSON.stringify({ selectedModel }),
                    })) as IntraNodeMsg<HaicLoggerSelectionOptions>;
                } else {
                    selectionOptionsResponse = (await $.getJSON(
                        `/node-red-contrib-humaine/flows/${localFlowId}/haic-logger/selection_options`,
                    )) as IntraNodeMsg<HaicLoggerSelectionOptions>;
                }

                if (selectionOptionsResponse.errorMsg) {
                    errorMsg = selectionOptionsResponse.errorMsg;
                } else {
                    selectionOptions = selectionOptionsResponse.payload;
                }
            } catch (error: any) {
                errorMsg = `Failed to get data from current flow in Node-Red runtime: ${error.message}.`;
                promptMsg =
                    "Check that Node-Red is running, and the AI Environment Configuration Node is placed in this flow!";
                console.error(
                    errorMsg,
                    "Flow ID",
                    localFlowId,
                    "Node ID",
                    localId,
                );
            }
        };

        // Initial fetch (GET if no model selected yet)
        await fetchSelectionOptions(currentSelectedModel || undefined);

        // Populate dropdowns with placeholder + preselection logic
        populateSelectWithOptions(
            actionSelectElement,
            selectionOptions.actions,
            currentSelectedAction,
        );
        populateSelectWithOptions(
            modelSelectElement,
            selectionOptions.models,
            currentSelectedModel,
        );
        populateSelectWithOptions(
            applicationSelectElement,
            selectionOptions.applications,
            currentSelectedApplication,
        );

        // Add change listener for model dropdown to trigger dynamic refresh
        modelSelectElement.addEventListener("change", async () => {
            const newModelId = modelSelectElement.value;

            if (newModelId) {
                errorMsg = "";
                promptMsg = "";

                await fetchSelectionOptions(newModelId);

                // Repopulate only dependent dropdowns
                populateSelectWithOptions(
                    actionSelectElement,
                    selectionOptions.actions,
                    node.affordance_action, // keep current value if valid
                );
            }
        });

        // Populate messages
        const errorElement = document.getElementById(
            "node-setup-message-haic-logger-options-error",
        );
        if (errorElement && errorMsg) {
            const pElement = errorElement.querySelector("p");
            if (pElement) {
                pElement.textContent = errorMsg;
                errorElement.style.display = "block";
            }
        } else if (errorElement) {
            errorElement.style.display = "none";
        }

        const messageElement = document.getElementById(
            "node-setup-message-haic-logger-options-message",
        );
        if (messageElement && promptMsg) {
            const pElement = messageElement.querySelector("p");
            if (pElement) {
                pElement.textContent = promptMsg;
                messageElement.style.display = "block";
            }
        } else if (messageElement) {
            messageElement.style.display = "none";
        }
    },
});
