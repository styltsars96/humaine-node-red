import { EditorRED } from "node-red";
import { AccessEvaluationResultsEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<AccessEvaluationResultsEditorNodeProperties>("access-evaluation-results", {
  category: "function",
  color: "#a6bbcf",
  defaults: {
    name: { value: "" },
  },
  inputs: 1,
  outputs: 1,
  icon: "file.png",
  paletteLabel: "access evaluation results",
  label: function () {
    return this.name || "access evaluation results";
  },
});
