import { NodeAPI, NodeInitializer } from "node-red";
import { HaicConfigNode, HaicConfigNodeDef } from "./modules/types";
import { OpenAPI } from "../../haic_client/core/OpenAPI";
import { getStringsRecord } from "../shared/helpers";

const nodeInit: NodeInitializer = function (RED: NodeAPI): void {
    function HaicConfigNodeConstructor(
        this: HaicConfigNode,
        config: HaicConfigNodeDef,
    ): void {
        // console.log("HaicConfigNodeConstructor", config);
        RED.nodes.createNode(this, config);
        const node = this;
        // console.log("Node created", node);

        node.name = config.name;

        // Set the OpenAPI configuration based on node settings
        if (config.baseUrl !== undefined && config.baseUrl !== "") {
            node.baseUrl = config.baseUrl;
        } else {
            node.baseUrl = "https://benchmark.humaine-horizon.eu/";
        }

        node.baseUrl = node.baseUrl.replace(/\/$/, ""); // Remove trailing slash, if exists.

        if (config.username !== undefined && config.username !== "") {
            node.username = config.username;
        }
        if (config.withCredentials !== undefined) {
            node.withCredentials = config.withCredentials;
        }
        let parsedHeaders: Record<string, string> | undefined = undefined;
        if (config.headers !== undefined && config.headers !== "") {
            parsedHeaders = getStringsRecord(config.headers);

            if (parsedHeaders) {
                node.headers = config.headers;
            } else {
                node.headers = undefined;
                parsedHeaders = undefined;
            }
        }

        node.OpenAPI = {
            BASE: node.baseUrl,
            VERSION: OpenAPI.VERSION,
            WITH_CREDENTIALS: node.withCredentials,
            CREDENTIALS: OpenAPI.CREDENTIALS,
            TOKEN: String(node.credentials.token),
            USERNAME: node.username,
            PASSWORD: String(node.credentials.password),
            HEADERS: parsedHeaders,
            ENCODE_PATH: OpenAPI.ENCODE_PATH,
        };
    }

    RED.nodes.registerType("haic-config", HaicConfigNodeConstructor, {
        credentials: {
            token: { type: "password" },
            password: { type: "password" },
        },
    });
};

export = nodeInit;
