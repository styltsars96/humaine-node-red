import { EditorRED } from "node-red";
import { HaicLoggerEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<HaicLoggerEditorNodeProperties>("haic-logger", {
    category: "HumAIne",
    color: "#58A69F",
    defaults: {
        name: { value: "" },
        application: { value: "", required: false },
        model: { value: "" },
        action: { value: "" },
        sessionIdJsonPath: { value: "$sessionId", required: false },
        // interactionIdJsonPath: { value: "$interactionId", required: false },
    },
    inputs: 1,
    outputs: 1,
    icon: "haic.svg",
    paletteLabel: "HAIC Logger",
    label: function () {
        return this.name || "HAIC Logger";
    },
    oneditprepare: async function () {},
});
