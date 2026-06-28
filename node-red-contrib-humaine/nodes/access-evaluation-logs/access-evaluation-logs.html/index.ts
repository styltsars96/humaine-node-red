import { EditorRED } from "node-red";
import { AccessEvaluationLogsEditorNodeProperties } from "./modules/types";
import {
    buildEvaluationApplicationOptions,
    populateSelectWithOptions,
    adminUrl,
} from "../../shared/helpers";
import { AppConfigsRefreshResult } from "../../ai-environment-config/shared/types";

type EvaluationApplicationOptionsResponse = AppConfigsRefreshResult & {
    defaultApplication: string;
};
declare const RED: EditorRED;

RED.nodes.registerType<AccessEvaluationLogsEditorNodeProperties>(
    "access-evaluation-logs",
    {
        category: "HumAIne",
        color: "#58A69F",
        defaults: {
            name: { value: "" },
            application: { value: "", required: false },
        },
        inputs: 1,
        outputs: 1,
        icon: "haic.svg",
        paletteLabel: "Access Evaluation Logs",
        label: function () {
            return this.name || "access evaluation logs";
        },
        oneditprepare: async function () {
            const node = this;
            const localFlowId = node.z;
            const applicationSelectElement = document.getElementById(
                "node-input-application",
            ) as HTMLSelectElement | null;
            const errorMessageElement = document.getElementById(
                "node-setup-message-evaluation-application-options-error",
            );
            const errorTextElement = errorMessageElement?.querySelector("p");

            if (!applicationSelectElement) return;

            let errorMsg = "";
            let response: EvaluationApplicationOptionsResponse = {
                appConfigsList: [],
                defaultApplication: "",
                errorMsg: undefined,
            };

            try {
                response = (await $.getJSON(
                    adminUrl(
                        `/flows/${localFlowId}/evaluation/application_list_refresh`,
                    ),
                )) as EvaluationApplicationOptionsResponse;
                errorMsg = response.errorMsg || "";
            } catch (error: unknown) {
                errorMsg =
                    error instanceof Error
                        ? `Failed to get application configurations from current flow in Node-RED runtime: ${error.message}.`
                        : "Failed to get application configurations from current flow in Node-RED runtime.";
            }

            const applicationOptions = buildEvaluationApplicationOptions(
                response.appConfigsList,
                response.defaultApplication,
                node.application,
            );

            populateSelectWithOptions(
                applicationSelectElement,
                applicationOptions.options,
                applicationOptions.selectedValue,
                false,
            );

            if (errorTextElement) {
                errorTextElement.textContent = errorMsg;
            }
            if (errorMessageElement) {
                errorMessageElement.style.display = errorMsg ? "block" : "none";
            }
        },
    },
);
