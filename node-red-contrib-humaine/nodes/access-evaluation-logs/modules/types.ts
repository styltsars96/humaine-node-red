import { Node, NodeDef } from "node-red";
import { AccessEvaluationLogsOptions } from "../shared/types";

export interface AccessEvaluationLogsNodeDef extends NodeDef, AccessEvaluationLogsOptions {}

export interface AccessEvaluationLogsNode extends Node {
    application?: string;
}
