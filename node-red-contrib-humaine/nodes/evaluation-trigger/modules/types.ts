import { Node, NodeDef } from "node-red";
import { EvaluationTriggerOptions } from "../shared/types";

export interface EvaluationTriggerNodeDef extends NodeDef, EvaluationTriggerOptions {}

// export interface EvaluationTriggerNode extends Node {}
export type EvaluationTriggerNode = Node;
