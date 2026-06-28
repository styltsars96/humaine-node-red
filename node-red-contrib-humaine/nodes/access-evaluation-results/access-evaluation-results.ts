import { NodeInitializer } from "node-red";
import { AccessEvaluationResultsNode, AccessEvaluationResultsNodeDef } from "./modules/types";
import { HAICFlowEnvironmentData } from "../shared/types";
import { HaicConfigNode } from "../haic-config/modules/types";
import { ResultsService } from "../../haic_client/services/ResultsService";

const nodeInit: NodeInitializer = (RED): void => {
    function AccessEvaluationResultsNodeConstructor(
        this: AccessEvaluationResultsNode,
        config: AccessEvaluationResultsNodeDef,
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
                        result = await ResultsService.getEvaluationResultsApiV1ResultsConfigurationIdGet(payload.configId, openAPI);
                        break;
                    case "getOne":
                        if (typeof payload.resultId !== "number") throw new Error("resultId is required for getOne");
                        result = await ResultsService.getEvaluationResultApiV1ResultsConfigurationIdResultIdGet(payload.configId, payload.resultId, openAPI);
                        break;
                    case "getGroup":
                        if (!payload.groupName) throw new Error("groupName is required for getGroup");
                        result = await ResultsService.getEvaluationResultsByGroupApiV1ResultsConfigurationIdGroupGroupNameGet(payload.configId, payload.groupName, openAPI);
                        break;
                    default: throw new Error("Unknown operation: " + operation);
                }
                send([{ payload: result }]);
                if (done) done();
            } catch (err: any) {
                const errorMsg = "Error in access-evaluation-results node: " + err.message;
                send([{ payload: err, error: errorMsg }]);
                if (done) done(null);
            }
        });
    }

    RED.nodes.registerType("access-evaluation-results", AccessEvaluationResultsNodeConstructor);
};

export = nodeInit;
