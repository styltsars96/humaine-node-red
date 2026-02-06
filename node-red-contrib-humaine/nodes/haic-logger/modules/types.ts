import { Node, NodeDef } from "node-red";
import { HaicLoggerOptions } from "../shared/types";

export interface HaicLoggerNodeDef extends NodeDef, HaicLoggerOptions {}

// export interface HaicLoggerNode extends Node {}
export type HaicLoggerNode = Node;
