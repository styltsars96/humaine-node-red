import { EditorNodeProperties } from "node-red";
import { EvaluationTriggerOptions } from "../../shared/types";

export interface EvaluationTriggerEditorNodeProperties
  extends EditorNodeProperties,
    EvaluationTriggerOptions {}
