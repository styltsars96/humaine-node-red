import { EditorRED } from "node-red";
import { EvaluationConfigEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<EvaluationConfigEditorNodeProperties>("evaluation-config", {
    category: "HumAIne",
    color: "#58A69F",
    defaults: {
        name: { value: "" },
    },
    inputs: 1,
    outputs: 1,
    icon: "haic.svg",
    paletteLabel: "Evaluation Config",
    label: function () {
        return this.name || "Evaluation Config";
    },
});
