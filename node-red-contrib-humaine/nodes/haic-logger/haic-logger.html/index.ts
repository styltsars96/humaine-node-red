import { EditorRED } from "node-red";
import { HaicLoggerEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<HaicLoggerEditorNodeProperties>("haic-logger", {
    category: "HumAIne",
    color: "#58A69F",
    defaults: {
        name: { value: "" },
        model: { value: "" },
        action: { value: "" },
        sessionIdJsonPath: { value: "$sessionId" },
        interactionIdJsonPath: { value: "$interactionId", required: false },
    },
    inputs: 1,
    outputs: 1,
    icon: "haic.svg",
    paletteLabel: "HAIC Logger",
    label: function () {
        return this.name || "AI Environment Config";
    },
    oneditprepare: async function () {},
});
