import { EditorRED } from "node-red";
import { AccessEvaluationResultsEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<AccessEvaluationResultsEditorNodeProperties>(
    "access-evaluation-results",
    {
        category: "HumAIne",
        color: "#58A69F",
        defaults: {
            name: { value: "" },
        },
        inputs: 1,
        outputs: 1,
        icon: "haic.svg",
        paletteLabel: "access evaluation results",
        label: function () {
            return this.name || "access evaluation results";
        },
    },
);
