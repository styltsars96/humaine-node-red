import { Node, NodeDef } from "node-red";
import { HaicConfigCredentials, HaicConfigOptions } from "../shared/types";
import { OpenAPIConfig } from "../../../haic_client/core/OpenAPI";

export interface HaicConfigNodeDef extends NodeDef, HaicConfigOptions {}

export interface HaicConfigNode
    extends Node<HaicConfigCredentials>, HaicConfigOptions {
    OpenAPI?: OpenAPIConfig;
}
// export type HaicConfigNode = Node;
