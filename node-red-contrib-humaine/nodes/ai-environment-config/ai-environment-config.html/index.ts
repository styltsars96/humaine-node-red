import { EditorRED } from "node-red";
import { AiEnvironmentConfigEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<AiEnvironmentConfigEditorNodeProperties>(
    "ai-environment-config",
    {
        category: "HumAIne HAIC Benchmark Suite",
        color: "#58A69F",
        defaults: {
            name: { value: "" },
            haic_server: { value: "", type: "haic-config", required: true },
        },
        inputs: 1,
        outputs: 1,
        icon: "haic.svg",
        paletteLabel: "AI Environment Config",
        label: function () {
            return this.name || "AI Environment Config";
        },
    },
);
