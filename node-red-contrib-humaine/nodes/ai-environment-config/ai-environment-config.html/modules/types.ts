import { EditorNodeProperties } from "node-red";
import { AiEnvironmentConfigOptions } from "../../shared/types";

export interface AiEnvironmentConfigEditorNodeProperties
    extends EditorNodeProperties, AiEnvironmentConfigOptions {}
