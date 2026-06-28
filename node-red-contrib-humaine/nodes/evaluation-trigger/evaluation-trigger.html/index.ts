import { EditorRED } from "node-red";
import { EvaluationTriggerEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<EvaluationTriggerEditorNodeProperties>(
    "evaluation-trigger",
    {
        category: "HumAIne",
        color: "#58A69F",
        defaults: {
            name: { value: "" },
        },
        inputs: 1,
        outputs: 1,
        icon: "haic.svg",
        paletteLabel: "evaluation trigger",
        label: function () {
            return this.name || "evaluation trigger";
        },
    },
);
