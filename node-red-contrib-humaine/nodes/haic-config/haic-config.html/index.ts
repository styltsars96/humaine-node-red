import { EditorRED } from "node-red";
import { HaicConfigEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<HaicConfigEditorNodeProperties>("haic-config", {
  category: "config",
  defaults: {
    name: { value: "" },
    baseUrl: { value: "", required: true },
    token: { value: "" },
    username: { value: "" },
    password: { value: "" },
    withCredentials: { value: false },
    headers: {
      value: "",
      required: false,
      validate: RED.validators.typedInput("json"),
    },
  },
  label: function () {
    return this.name || "haic API config";
  },
});
