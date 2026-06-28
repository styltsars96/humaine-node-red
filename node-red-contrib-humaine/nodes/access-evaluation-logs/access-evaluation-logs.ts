import { NodeInitializer } from "node-red";
import { AccessEvaluationLogsNode, AccessEvaluationLogsNodeDef } from "./modules/types";
import { HAICFlowEnvironmentData } from "../shared/types";
import { HaicConfigNode } from "../haic-config/modules/types";
import { LogsService } from "../../haic_client/services/LogsService";

const nodeInit: NodeInitializer = (RED): void => {
    function AccessEvaluationLogsNodeConstructor(
        this: AccessEvaluationLogsNode,
        config: AccessEvaluationLogsNodeDef,
    ): void {
        RED.nodes.createNode(this, config);

        const node = this;
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
                const payload: Record<string, any> = msg.payload || {};
                if (typeof payload.configId !== "number") throw new Error("configId is required");
                const operation = payload.operation || "getAll";
                delete payload.operation;

                let result: any;
                switch (operation) {
                    case "getAll":
                        result = await LogsService.listLogsApiV1LogsConfigIdGet(payload.configId, openAPI);
                        break;
                    case "getOne":
                    case "downloadLink":
                        if (!payload.logName) throw new Error("logName is required for getOne/downloadLink");
                        result = await LogsService.getDownloadUrlApiV1LogsDownloadConfigIdGet(payload.configId, payload.logName, openAPI);
                        break;
                    default: throw new Error("Unknown operation: " + operation);
                }
                send([{ payload: result }]);
                if (done) done();
            } catch (err: any) {
                const errorMsg = "Error in access-evaluation-logs node: " + err.message;
                send([{ payload: err, error: errorMsg }]);
                if (done) done(null);
            }
        });
    }

    RED.nodes.registerType("access-evaluation-logs", AccessEvaluationLogsNodeConstructor);
};

export = nodeInit;
