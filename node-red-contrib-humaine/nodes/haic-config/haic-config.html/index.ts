import { EditorRED } from "node-red";
import { HaicConfigCredentials } from "../shared/types";
import { HaicConfigEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<HaicConfigEditorNodeProperties, HaicConfigCredentials>(
    "haic-config",
    {
        category: "config",
        defaults: {
            name: { value: "", required: true },
            baseUrl: { value: "", required: true },
            username: { value: "" },
            withCredentials: { value: false },
            headers: {
                value: "",
                required: false,
            },
        },
        credentials: {
            token: { type: "password" },
            password: { type: "password" },
        },
        label: function () {
            return this.name || this.baseUrl || "HAIC API config";
        },
    },
);
