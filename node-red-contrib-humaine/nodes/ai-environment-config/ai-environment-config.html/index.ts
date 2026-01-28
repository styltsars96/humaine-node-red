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
    },
    inputs: 1,
    outputs: 1,
    icon: "haic_icon_small.svg",
    paletteLabel: "ai environment config",
    label: function () {
      return this.name || "ai environment config";
    },
  },
);
