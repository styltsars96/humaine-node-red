import { EditorNodeProperties } from "node-red";
import { HaicConfigOptions } from "../../shared/types";

export interface HaicConfigEditorNodeProperties
    extends EditorNodeProperties, HaicConfigOptions {}
