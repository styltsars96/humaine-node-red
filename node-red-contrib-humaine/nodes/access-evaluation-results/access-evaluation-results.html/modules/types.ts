import { EditorNodeProperties } from "node-red";
import { AccessEvaluationResultsOptions } from "../../shared/types";

export interface AccessEvaluationResultsEditorNodeProperties
  extends EditorNodeProperties,
    AccessEvaluationResultsOptions {}
