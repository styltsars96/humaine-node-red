import { Node, NodeDef } from "node-red";
import { AccessEvaluationResultsOptions } from "../shared/types";

export interface AccessEvaluationResultsNodeDef extends NodeDef, AccessEvaluationResultsOptions {}

export interface AccessEvaluationResultsNode extends Node {
    application?: string;
}
