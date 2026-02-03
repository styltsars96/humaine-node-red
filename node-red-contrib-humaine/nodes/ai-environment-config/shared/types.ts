import { envMetaSchema } from "../../../haic_client/schemas/EnvMeta";
import { z } from "zod";

export interface AiEnvironmentConfigOptions {
    haic_server: string;
    aiEnvironmentId: string;
}

export const EnvsMetaListSchema = z.array(envMetaSchema);
export type EnvsMetaList = z.infer<typeof EnvsMetaListSchema>;
