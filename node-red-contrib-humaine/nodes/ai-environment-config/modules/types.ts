import { Node, NodeDef } from "node-red";
import { AiEnvironmentConfigOptions } from "../shared/types";

export interface AiEnvironmentConfigNodeDef
    extends NodeDef, AiEnvironmentConfigOptions {}

export interface AiEnvironmentConfigNode extends Node {
    aiEnvironmentId: string;
}
