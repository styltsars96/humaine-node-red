import { NodeInitializer, NodeAPI } from "node-red";
import { HaicConfigNode, HaicConfigNodeDef } from "./modules/types";
import { OpenAPI } from "../../haic_client/core/OpenAPI";
import { getStringsRecord } from "../shared/helpers";

const nodeInit: NodeInitializer = (RED: NodeAPI): void => {
    function HaicConfigNodeConstructor(
        this: HaicConfigNode,
        config: HaicConfigNodeDef,
    ): void {
        console.log("HaicConfigNodeConstructor", config);
        RED.nodes.createNode(this, config);
        const node = this;
        console.log("Node created", node);

        // Set the OpenAPI configuration based on node settings
        if (config.baseUrl !== undefined && config.baseUrl !== "") {
            node.baseUrl = config.baseUrl;
            OpenAPI.BASE = config.baseUrl;
        }
        if (config.token !== undefined && config.token !== "") {
            node.token = config.token;
            OpenAPI.TOKEN = config.token;
        }
        if (
            config.username !== undefined &&
            config.username !== "" &&
            config.password !== undefined &&
            config.password !== ""
        ) {
            node.username = config.username;
            node.password = config.password;
            OpenAPI.USERNAME = config.username;
            OpenAPI.PASSWORD = config.password;
        }
        if (config.withCredentials !== undefined) {
            node.withCredentials = config.withCredentials;
            OpenAPI.WITH_CREDENTIALS = config.withCredentials;
        }
        if (config.headers !== undefined && config.headers !== "") {
            const parsedHeaders = getStringsRecord(config.headers);

            if (parsedHeaders) {
                node.headers = config.headers;
                OpenAPI.HEADERS = parsedHeaders;
            } else {
                node.headers = undefined;
                OpenAPI.HEADERS = undefined;
            }
        }
        node.OpenAPI = OpenAPI;
    }

    RED.nodes.registerType("haic-config", HaicConfigNodeConstructor, {
        credentials: {
            token: { type: "password" },
            username: { type: "text" },
            password: { type: "password" },
        },
    });
};

export = nodeInit;
