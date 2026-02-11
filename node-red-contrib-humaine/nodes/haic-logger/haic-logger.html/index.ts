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
        sessionIdJsonPath: { value: "$session_id", required: false },
        // interactionIdJsonPath: { value: "$interactionId", required: false },
    },
    inputs: 1,
    outputs: 1,
    icon: "haic.svg",
    paletteLabel: "HAIC Logger",
    label: function () {
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

        try {
            // Get all the node's dynamic options
            const selectionOptionsResponse = (await $.getJSON(
                `/node-red-contrib-humaine/flows/${localFlowId}/haic-logger/selection_options`,
            )) as IntraNodeMsg<HaicLoggerSelectionOptions>;

            if (selectionOptionsResponse.errorMsg) {
                errorMsg = selectionOptionsResponse.errorMsg;
            } else {
                selectionOptions = selectionOptionsResponse.payload;
            }
        } catch (error: any) {
            errorMsg = `Failed to get data from current flow in Node-Red runtime: ${error.message}.`;
            promptMsg =
                "Check that Node-Red is running, and the AI Environment Configuration Node is placed in this flow!";
            console.error(errorMsg, "Flow ID", localFlowId, "Node ID", localId);
        }

        if (!errorMsg) {
            if (selectionOptions.actions.length === 0) {
                errorMsg +=
                    " No available actions! Set your AI process environment properly! ";
            }

            if (selectionOptions.models.length === 0) {
                errorMsg +=
                    " No available models! Set your AI process environment properly! ";
            }

            if (selectionOptions.applications.length === 0) {
                errorMsg +=
                    " No available applications! Set HAIC evaluation configurations properly! ";
            }

            // Store the currently selected values before clearing
            const currentSelectedAction = node.affordance_action;
            const currentSelectedModel = node.model;
            const currentSelectedApplication = node.application;

            const actionSelectElement = document.getElementById(
                "node-input-affordance_action",
            ) as HTMLSelectElement;
            actionSelectElement.innerHTML = "";
            const modelSelectElement = document.getElementById(
                "node-input-model",
            ) as HTMLSelectElement;
            modelSelectElement.innerHTML = "";
            const applicationSelectElement = document.getElementById(
                "node-input-application",
            ) as HTMLSelectElement;
            applicationSelectElement.innerHTML = "";

            // Populate the dropdowns with the options
            populateSelectWithOptions(
                actionSelectElement,
                selectionOptions.actions,
            );
            populateSelectWithOptions(
                modelSelectElement,
                selectionOptions.models,
            );
            populateSelectWithOptions(
                applicationSelectElement,
                selectionOptions.applications,
            );

            // Restored values if already pre-selected and valid
            if (
                currentSelectedAction &&
                selectionOptions.actions.some(
                    (action) => action.id == currentSelectedAction,
                )
            ) {
                actionSelectElement.value = currentSelectedAction;
            }
            if (
                currentSelectedModel &&
                selectionOptions.models.some(
                    (model) => model.id == currentSelectedAction,
                )
            ) {
                modelSelectElement.value = currentSelectedModel;
            }
            if (
                currentSelectedApplication &&
                selectionOptions.applications.some(
                    (application) =>
                        application.id == currentSelectedApplication,
                )
            ) {
                applicationSelectElement.value = currentSelectedApplication;
            }
        }

        // Populate the messages
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
