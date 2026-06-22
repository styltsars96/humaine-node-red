import { EditorRED } from "node-red";
import { HaicLoggerEditorNodeProperties } from "./modules/types";
import { IntraNodeMsg, HaicLoggerSelectionOptions } from "../../shared/types";
import { populateSelectWithOptions, adminUrl } from "../../shared/helpers";

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
                        url: adminUrl(
                            `/flows/${localFlowId}/haic-logger/selection_options`,
                        ),
                        method: "POST",
                        contentType: "application/json",
                        data: JSON.stringify({ selectedModel }),
                    })) as IntraNodeMsg<HaicLoggerSelectionOptions>;
                } else {
                    selectionOptionsResponse = (await $.getJSON(
                        adminUrl(
                            `/flows/${localFlowId}/haic-logger/selection_options`,
                        ),
                    )) as IntraNodeMsg<HaicLoggerSelectionOptions>;
                }

                // Always apply whatever payload the runtime returned, even when
                // an errorMsg is also present: the payload carries the
                // authoritative (possibly empty) option lists, so the dropdowns
                // reflect the real state instead of stale data from a previous
                // successful fetch.
                selectionOptions = selectionOptionsResponse.payload ?? {
                    actions: [],
                    applications: [],
                    models: [],
                };
                errorMsg = selectionOptionsResponse.errorMsg || "";
            } catch (error: any) {
                // Transport failure (timeout, CORS, 5xx, ...). Reset to a clean,
                // empty fallback so the dropdowns are repopulated into a coherent
                // state (saved selections preserved as "unavailable", empty lists
                // shown as "No available options") rather than left stale/blank.
                selectionOptions = {
                    actions: [],
                    applications: [],
                    models: [],
                };
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

        // Render the error/prompt message boxes from the current state. Called
        // after every fetch so messages stay in sync (and clear) on re-fetch.
        const renderMessages = () => {
            const errorElement = document.getElementById(
                "node-setup-message-haic-logger-options-error",
            );
            if (errorElement) {
                const pElement = errorElement.querySelector("p");
                if (pElement) {
                    pElement.textContent = errorMsg;
                }
                errorElement.style.display = errorMsg ? "block" : "none";
            }

            const messageElement = document.getElementById(
                "node-setup-message-haic-logger-options-message",
            );
            if (messageElement) {
                const pElement = messageElement.querySelector("p");
                if (pElement) {
                    pElement.textContent = promptMsg;
                }
                messageElement.style.display = promptMsg ? "block" : "none";
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

        // Render any messages produced by the initial fetch.
        renderMessages();

        // Add change listener for model dropdown to trigger dynamic refresh
        modelSelectElement.addEventListener("change", async () => {
            const newModelId = modelSelectElement.value;

            if (!newModelId) {
                return;
            }

            errorMsg = "";
            promptMsg = "";

            await fetchSelectionOptions(newModelId);

            // Repopulate the dependent action dropdown. selectionOptions.actions
            // is now authoritative for the newly selected model (empty on error),
            // so the dropdown shows the new model's actions, or a clear "No
            // available options"/error state — never stale actions or a silent
            // blank. We pass preserveMissingPreselection=false so a saved action
            // that does not belong to the new model is not kept around.
            populateSelectWithOptions(
                actionSelectElement,
                selectionOptions.actions,
                node.affordance_action, // keep current value only if still valid
                false,
            );

            // Reflect any error/empty state from this refresh in the UI.
            renderMessages();
        });
    },
});
