import { NodeInitializer } from "node-red";
import { HaicLoggerNode, HaicLoggerNodeDef } from "./modules/types";

// Simple JSONPath implementation for basic paths
type JsonValue = any;
function getJsonPath(obj: JsonValue, path: string): JsonValue {
    if (!path) return obj;

    // Handle $ prefix and split by dots or brackets
    const parts = path
        .replace(/^\$\.?/, "")
        .split(/[.\\[\\]]/)
        .filter(Boolean);

    let result: JsonValue = obj;
    for (const part of parts) {
        if (result == null) return undefined;
        result = result[part];
    }

    return result;
}

const nodeInit: NodeInitializer = (RED): void => {
    function HaicLoggerNodeConstructor(
        this: HaicLoggerNode,
        config: HaicLoggerNodeDef,
    ): void {
        RED.nodes.createNode(this, config);

        const node = this;

        // Store config values
        node.model = config.model || "";
        node.affordance_action = config.affordance_action || "";
        node.application = config.application || "";
        node.sessionIdJsonPath = config.sessionIdJsonPath || "$session_id";
        // const interactionIdPath = config.interactionIdJsonPath || "$interactionId";

        node.on("input", (msg, send, done) => {
            try {
                // Extract session ID and optional interaction ID from msg.payload using JSON paths
                const sessionId = getJsonPath(
                    msg.payload,
                    node.sessionIdJsonPath,
                );

                send(msg);
                done();
            } catch (err) {
                node.error(`Error in haic-logger: ${err.message}`, msg);
                done(err);
            }
        });
    }

    RED.nodes.registerType("haic-logger", HaicLoggerNodeConstructor);
};

export = nodeInit;
