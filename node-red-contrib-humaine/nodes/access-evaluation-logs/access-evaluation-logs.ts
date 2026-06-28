import { NodeInitializer } from "node-red";
import { AccessEvaluationLogsNode, AccessEvaluationLogsNodeDef } from "./modules/types";
import { HAICFlowEnvironmentData } from "../shared/types";
import { HaicConfigNode } from "../haic-config/modules/types";
import { LogsService } from "../../haic_client/services/LogsService";
import { resolveEvaluationConfigId } from "../shared/helpers";

const nodeInit: NodeInitializer = (RED): void => {
    function AccessEvaluationLogsNodeConstructor(
        this: AccessEvaluationLogsNode,
        config: AccessEvaluationLogsNodeDef,
    ): void {
        RED.nodes.createNode(this, config);

        const node = this;
        node.application = config.application;
        const flowContext = node.context().flow;
        const haicEnvironment = flowContext.get("HumAIne_HAIC_ENVIRONMENT") as
            | HAICFlowEnvironmentData
            | undefined;

        if (!haicEnvironment) {
            node.error("No AI Environment setup! Set an AI Environment config in the flow first.");
            return;
        }

        const openAPI = (RED.nodes.getNode(haicEnvironment.haicApiNodeId) as HaicConfigNode).OpenAPI;

        node.on("input", async function (msg, send, done) {
            try {
                const payload =
                    msg.payload && typeof msg.payload === "object"
                        ? (msg.payload as Record<string, unknown>)
                        : {};
                const configId = resolveEvaluationConfigId(
                    payload,
                    config.application,
                    flowContext.get("HumAIne_DEFAULT_APPLICATION") as string | undefined,
                );
                const operation =
                    typeof payload.operation === "string"
                        ? payload.operation
                        : "getAll";

                let result: unknown;
                switch (operation) {
                    case "getAll":
                        result = await LogsService.listLogsApiV1LogsConfigIdGet(configId, openAPI);
                        break;
                    case "getOne":
                    case "downloadLink":
                        if (typeof payload.logName !== "string") throw new Error("logName is required for getOne/downloadLink");
                        result = await LogsService.getDownloadUrlApiV1LogsDownloadConfigIdGet(configId, payload.logName, openAPI);
                        break;
                    default: throw new Error("Unknown operation: " + operation);
                }
                send([{ payload: result }]);
                if (done) done();
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : String(err);
                const errorMsg = "Error in access-evaluation-logs node: " + errorMessage;
                send([{ payload: err, error: errorMsg }]);
                if (done) done(null);
            }
        });
    }

    RED.nodes.registerType("access-evaluation-logs", AccessEvaluationLogsNodeConstructor);
};

export = nodeInit;
