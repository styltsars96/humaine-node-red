import { EditorRED } from "node-red";
import { EvaluationTriggerEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<EvaluationTriggerEditorNodeProperties>("evaluation-trigger", {
  category: "function",
  color: "#a6bbcf",
  defaults: {
    name: { value: "" },
  },
  inputs: 1,
  outputs: 1,
  icon: "file.png",
  paletteLabel: "evaluation trigger",
  label: function () {
    return this.name || "evaluation trigger";
  },
});
