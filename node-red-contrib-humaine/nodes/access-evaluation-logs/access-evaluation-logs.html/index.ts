import { EditorRED } from "node-red";
import { AccessEvaluationLogsEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<AccessEvaluationLogsEditorNodeProperties>(
    "access-evaluation-logs",
    {
        category: "HumAIne",
        color: "#58A69F",
        defaults: {
            name: { value: "" },
        },
        inputs: 1,
        outputs: 1,
        icon: "haic.svg",
        paletteLabel: "access evaluation logs",
        label: function () {
            return this.name || "access evaluation logs";
        },
    },
);
