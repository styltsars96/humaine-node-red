import { Node, NodeDef } from "node-red";
import { HaicConfigOptions } from "../shared/types";

export interface HaicConfigNodeDef extends NodeDef, HaicConfigOptions {}

// export interface HaicConfigNode extends Node {}
export type HaicConfigNode = Node;
