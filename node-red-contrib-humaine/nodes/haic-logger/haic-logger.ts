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
        const model = config.model || "";
        const action = config.action || "";
        const sessionIdPath = config.sessionIdJsonPath || "$sessionId";
        const interactionIdPath =
            config.interactionIdJsonPath || "$interactionId";

        node.on("input", (msg, send, done) => {
            try {
                // Extract session ID and optional interaction ID from msg.payload using JSON paths
                const sessionId = getJsonPath(msg.payload, sessionIdPath);
                const interactionId = interactionIdPath
                    ? getJsonPath(msg.payload, interactionIdPath)
                    : undefined;

                // Create log entry with model, action, session ID, and optional interaction ID
                const logEntry: Record<string, string | number> = {
                    model,
                    action,
                    sessionId,
                };

                if (interactionId !== undefined && interactionId !== null) {
                    logEntry.interactionId = interactionId;
                }

                // Log the entry
                node.debug(`HAIC Logger: ${JSON.stringify(logEntry)}`);

                // Pass message through unchanged
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
