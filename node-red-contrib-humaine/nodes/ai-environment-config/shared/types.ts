import { envMetaSchema } from "../../../haic_client/schemas/EnvMeta";
import { evaluationConfigSchemaSchema } from "../../../haic_client/schemas/EvaluationConfigSchema";
import { z } from "zod";

export interface AiEnvironmentConfigOptions {
    haic_server: string;
    aiEnvironmentId: string;
    defaultApplication?: string;
}

export const EnvsMetaListSchema = z.array(envMetaSchema);
export type EnvsMetaList = z.infer<typeof EnvsMetaListSchema>;

export const EvaluationConfigListSchema = z.array(evaluationConfigSchemaSchema);
export type EvaluationConfigList = z.infer<typeof EvaluationConfigListSchema>;

// export type HumAIneEnvironmentData = z.infer<
//     typeof HumAIneEnvironmentDataSchema
// >;
