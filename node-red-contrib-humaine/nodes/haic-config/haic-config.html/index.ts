import { EditorRED } from "node-red";

declare const RED: EditorRED;

RED.nodes.registerType("haic-config", {
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
});
