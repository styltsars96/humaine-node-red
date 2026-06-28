import { NodeInitializer } from "node-red";
import { EvaluationTriggerNode, EvaluationTriggerNodeDef } from "./modules/types";
import { HAICFlowEnvironmentData } from "../shared/types";
import { HaicConfigNode } from "../haic-config/modules/types";
import { EvaluationService } from "../../haic_client/services/EvaluationService";

const nodeInit: NodeInitializer = (RED): void => {
    function EvaluationTriggerNodeConstructor(
        this: EvaluationTriggerNode,
        config: EvaluationTriggerNodeDef,
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
                send([{ payload: await EvaluationService.evaluateConfigApiV1EvaluateConfigurationIdPost(payload.configId, openAPI) }]);
                if (done) done();
            } catch (err: any) {
                const errorMsg = "Error in evaluation-trigger node: " + err.message;
                send([{ payload: err, error: errorMsg }]);
                if (done) done(null);
            }
        });
    }

    RED.nodes.registerType("evaluation-trigger", EvaluationTriggerNodeConstructor);
};

export = nodeInit;
