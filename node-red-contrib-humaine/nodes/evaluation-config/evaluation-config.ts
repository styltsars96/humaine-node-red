import { NodeInitializer } from "node-red";
import { EvaluationConfigNode, EvaluationConfigNodeDef } from "./modules/types";
import { HAICFlowEnvironmentData } from "../shared/types";
import { HaicConfigNode } from "../haic-config/modules/types";
import { ConfigurationService } from "../../haic_client/services/ConfigurationService";
import type { EvaluationConfigSchema } from "../../haic_client/models/EvaluationConfigSchema";

const nodeInit: NodeInitializer = (RED): void => {
    function EvaluationConfigNodeConstructor(
        this: EvaluationConfigNode,
        config: EvaluationConfigNodeDef,
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
                const operation = payload.operation;
                delete payload.operation;

                switch (operation) {
                    case "get": {
                        if (typeof payload.id !== "number") throw new Error("id is required for get");
                        send([{ payload: await ConfigurationService.getConfigurationApiV1ConfigurationConfigurationIdGet(payload.id, openAPI) }]);
                        break;
                    }
                    case "create": {
                        send([{ payload: await ConfigurationService.createConfigurationApiV1ConfigurationNewPost(payload as EvaluationConfigSchema, openAPI) }]);
                        break;
                    }
                    case "update": {
                        if (typeof payload.configurationId !== "number") throw new Error("configurationId is required for update");
                        const data = { ...payload }; delete (data as any).configurationId;
                        send([{ payload: await ConfigurationService.updateConfigurationApiV1ConfigurationUpdateConfigurationIdPut(payload.configurationId, data as EvaluationConfigSchema, openAPI) }]);
                        break;
                    }
                    case "delete": {
                        if (typeof payload.id !== "number") throw new Error("id is required for delete");
                        send([{ payload: await ConfigurationService.deleteConfigurationApiV1ConfigurationDeleteConfigurationIdDelete(payload.id, openAPI) }]);
                        break;
                    }
                    default: throw new Error("Unknown operation: " + operation);
                }
                if (done) done();
            } catch (err: any) {
                const errorMsg = "Error in evaluation-config node: " + err.message;
                send([{ payload: err, error: errorMsg }]);
                if (done) done(null);
            }
        });
    }

    RED.nodes.registerType("evaluation-config", EvaluationConfigNodeConstructor);
};

export = nodeInit;
