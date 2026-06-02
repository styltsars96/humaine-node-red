import { NodeInitializer } from "node-red";
import { LogSchema, LogsService } from "../../haic_client";
import { HaicLoggerNode, HaicLoggerNodeDef } from "./modules/types";
import { HAICFlowEnvironmentData } from "../shared/types";
import { HaicConfigNode } from "../haic-config/modules/types";
import { AiEnvironmentConfigNode } from "../ai-environment-config/modules/types";
import { logSchemaSchema } from "../../haic_client/schemas/LogSchema";
import {
    showErrorStatus,
    getJsonPath,
    showSuccessStatus,
} from "../shared/helpers";

const STATUS_MSG_TIMEOUT = 3000;

// Type guard to safely access payload properties
type PayloadWithLogData = {
    user_id?: string;
    ai_model_version?: string | null;
    app_version?: string;
    start_time?: string;
    end_time?: string;
    interaction_data?: any;
    retrain_events?: any[];
    performance_infrastructure?: any;
    performance_logs?: any;
    ai_model_data?: any;
    decisions?: any; // TODO: THIS NEEDS TO HAVE ACTION AND AFFORDANCE! BASED ON GFRAGI's output
};

const nodeInit: NodeInitializer = (RED): void => {
    function HaicLoggerNodeConstructor(
        this: HaicLoggerNode,
        config: HaicLoggerNodeDef,
    ): void {
        RED.nodes.createNode(this, config);

        const node = this;
        const flowContext = node.context().flow;
        const haicEnvironment = flowContext.get("HumAIne_HAIC_ENVIRONMENT") as
            | HAICFlowEnvironmentData
            | undefined;
        if (!haicEnvironment) {
            node.error(
                "No AI Environment setup is done! Set an AI Environment config in the flow first.",
            );
            node.status({
                fill: "red",
                shape: "dot",
                text: `No AI Environment setup in this flow!`,
            });
            return;
        }

        const openAPI = (
            RED.nodes.getNode(haicEnvironment.haicApiNodeId) as HaicConfigNode
        ).OpenAPI;

        // Store config values
        node.model = config.model || "";
        node.affordance_action = config.affordance_action || "";
        node.application = config.application || "";
        node.sessionIdJsonPath =
            config.sessionIdJsonPath || "$payload.session_id";
        // const interactionIdPath = config.interactionIdJsonPath || "$interactionId";

        let application = node.application;
        if (!application) {
            application = (
                RED.nodes.getNode(
                    haicEnvironment.haicEnvironmentNodeId,
                ) as AiEnvironmentConfigNode
            ).defaultApplication;
        }

        if (!node.model || !node.affordance_action || !application) {
            node.status({
                fill: "red",
                shape: "ring",
                text: `Incomplete logger node setup!`,
            });
            let setupErrorMsg = "";
            if (!node.model) setupErrorMsg += "Model / Agent is not selected! ";
            if (!node.affordance_action)
                setupErrorMsg += "Action / Affordance is not selected! ";
            if (!application)
                setupErrorMsg +=
                    "Application is not selected, and no default application for the flow has been set!";

            return;
        }

        node.status({
            fill: "green",
            shape: "dot",
            text: "Ready to log!",
        });

        node.on("input", async function (msg) {
            try {
                // Extract session ID from msg using JSON path
                const sessionId = getJsonPath(msg, node.sessionIdJsonPath);

                if (sessionId === undefined || sessionId === null) {
                    node.error(
                        `session_id value not found at path "${node.sessionIdJsonPath}"`,
                    );
                    showErrorStatus(
                        node,
                        "Invalid input log data!",
                        "Ready to log!",
                        STATUS_MSG_TIMEOUT,
                    );
                    return;
                }

                // Safely extract payload data with type assertion
                const payload = msg.payload as PayloadWithLogData;

                // Prepare the log object with required fields
                const logData: LogSchema = {
                    session_id: String(sessionId),
                    user_id: payload.user_id || "unknown",
                    ai_model_version: payload.ai_model_version ?? null,
                    app_version: payload.app_version || "1.0.0",
                    start_time: payload.start_time || new Date().toISOString(),
                    end_time: payload.end_time || new Date().toISOString(),
                    interaction_data: payload.interaction_data ?? null,
                    retrain_events: Array.isArray(payload.retrain_events)
                        ? payload.retrain_events
                        : [],
                    performance_infrastructure:
                        payload.performance_infrastructure ?? null,
                    performance_logs: payload.performance_logs ?? null,
                    ai_model_data: payload.ai_model_data ?? null,
                    decisions: payload.decisions ?? null,
                };

                // Validate against the Zod schema
                const result = logSchemaSchema.safeParse(logData);

                if (!result.success) {
                    // Format validation errors for better readability
                    const errorMessages = result.error.issues
                        .map(
                            (err) =>
                                `Path: ${err.path.join(".")} - ${err.message}`,
                        )
                        .join("\n");

                    node.error(`Log data validation failed:\n${errorMessages}`);
                    showErrorStatus(
                        node,
                        "Invalid input log data!",
                        "Ready to log!",
                        STATUS_MSG_TIMEOUT,
                    );
                    return;
                }

                // Send the validated log to HAIC service
                await LogsService.registerLogApiV1LogsRegisterPost(
                    parseInt(application),
                    result.data,
                    openAPI,
                );
                msg.payload = logData;
            } catch (err: any) {
                const errorMsg = `Error in haic-logger: ${err.message}`;
                node.error(errorMsg, msg);
                showErrorStatus(
                    node,
                    "Error during handling input!",
                    "Ready to log!",
                    STATUS_MSG_TIMEOUT,
                );
                msg.error = errorMsg;
            }

            showSuccessStatus(
                node,
                "Log registered successfully",
                "Ready to log!",
                STATUS_MSG_TIMEOUT,
            );

            node.send(msg);
        });
    }

    RED.nodes.registerType("haic-logger", HaicLoggerNodeConstructor);
};

export = nodeInit;
