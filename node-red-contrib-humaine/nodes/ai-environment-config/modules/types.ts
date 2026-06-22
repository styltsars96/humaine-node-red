import { Node, NodeDef } from "node-red";
import { AiEnvironmentConfigOptions } from "../shared/types";

export interface AiEnvironmentConfigNodeDef
    extends NodeDef, AiEnvironmentConfigOptions {}

export interface AiEnvironmentConfigNode extends Node {
    aiEnvironmentId: string;
    defaultApplication?: string;
    // In-flight refresh promises used for single-flight de-duplication between
    // the startup refresh and on-demand editor fetches (see ensureEnvData /
    // ensureAppConfigs). Undefined when no refresh is currently running.
    envRefreshPromise?: Promise<unknown>;
    appConfigsRefreshPromise?: Promise<unknown>;
}
