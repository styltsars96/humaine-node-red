import { EditorNodeProperties } from "node-red";
import { AccessEvaluationLogsOptions } from "../../shared/types";

export interface AccessEvaluationLogsEditorNodeProperties
  extends EditorNodeProperties,
    AccessEvaluationLogsOptions {}
