import { EditorRED } from "node-red";
import { AccessEvaluationLogsEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<AccessEvaluationLogsEditorNodeProperties>("access-evaluation-logs", {
  category: "function",
  color: "#a6bbcf",
  defaults: {
    name: { value: "" },
  },
  inputs: 1,
  outputs: 1,
  icon: "file.png",
  paletteLabel: "access evaluation logs",
  label: function () {
    return this.name || "access evaluation logs";
  },
});
