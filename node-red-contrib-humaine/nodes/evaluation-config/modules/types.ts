import { Node, NodeDef } from "node-red";

export interface EvaluationConfigNodeOptions {}

export interface EvaluationConfigNodeDef extends NodeDef, EvaluationConfigNodeOptions {
    name: string;
}

export interface EvaluationConfigEditorNodeProperties {
    name: string;
}

export interface EvaluationConfigNode extends Node {
    name: string;
}
