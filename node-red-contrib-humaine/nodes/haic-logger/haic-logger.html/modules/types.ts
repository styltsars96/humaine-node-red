import { EditorNodeProperties } from "node-red";
import { HaicLoggerOptions } from "../../shared/types";

export interface HaicLoggerEditorNodeProperties
  extends EditorNodeProperties,
    HaicLoggerOptions {}
