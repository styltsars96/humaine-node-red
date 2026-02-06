import { envMetaSchema } from "../../../haic_client/schemas/EnvMeta";
import { z } from "zod";

export interface AiEnvironmentConfigOptions {
    haic_server: string;
    aiEnvironmentId: string;
}

export const EnvsMetaListSchema = z.array(envMetaSchema);
export type EnvsMetaList = z.infer<typeof EnvsMetaListSchema>;

// Types for HumAIne AI Process Environment data structure
export interface AgentAffordance {
    id: string;
    class: string;
    model?: string | null;
    attributes: Record<string, any>;
    affordances: string[];
    label: string;
}

export interface ObjectAffordance {
    id: string;
    class: string;
    model?: string | null;
    attributes: Record<string, any>;
    affordances: string[];
    label: string;
}

export interface ScriptAction {
    t: number; // time in seconds
    agent: string;
    action: string;
    object: string;
    effect: Record<string, any>;
    latency_ms?: number | null;
    duration_s?: number | null;
    correct?: boolean;
}

export interface EnvironmentMeta {
    env_id: string;
    sim_id: string;
    domain: string;
    task: string;
    version: string | null;
}

export interface BlocksMeta {
    meta: EnvironmentMeta;
    blocks: (AgentAffordance | ObjectAffordance)[];
}

export interface HumAIneEnvironmentData {
    env: {
        sim_id: string;
        environment: {
            id: string;
            class: string;
            attributes: Record<string, any>;
        };
        agents: AgentAffordance[];
        objects: ObjectAffordance[];
        script: ScriptAction[];
    };
    blocks: BlocksMeta;
}

export const HumAIneEnvironmentDataSchema = z.object({
    env: z.object({
        sim_id: z.string(),
        environment: z.object({
            id: z.string(),
            class: z.string(),
            attributes: z.record(z.string(), z.any()),
        }),
        agents: z.array(
            z.object({
                id: z.string(),
                class: z.string(),
                model: z.union([z.string(), z.null()]).optional(),
                attributes: z.record(z.string(), z.any()),
                affordances: z.array(z.string()),
                label: z.string(),
            }),
        ),
        objects: z.array(
            z.object({
                id: z.string(),
                class: z.string(),
                model: z.union([z.string(), z.null()]).optional(),
                attributes: z.record(z.string(), z.any()),
                affordances: z.array(z.string()),
                label: z.string(),
            }),
        ),
        script: z.array(
            z.object({
                t: z.number(),
                agent: z.string(),
                action: z.string(),
                object: z.string(),
                effect: z.record(z.string(), z.any()),
                latency_ms: z.union([z.number(), z.null()]).optional(),
                duration_s: z.union([z.number(), z.null()]).optional(),
                correct: z.boolean().optional(),
            }),
        ),
    }),
    blocks: z.object({
        meta: z.object({
            env_id: z.string(),
            sim_id: z.string(),
            domain: z.string(),
            task: z.string(),
            version: z.union([z.string(), z.null()]),
        }),
        blocks: z.array(
            z.discriminatedUnion("kind", [
                z.object({
                    kind: z.literal("agent"),
                    id: z.string(),
                    class: z.string(),
                    model: z.union([z.string(), z.null()]).optional(),
                    attributes: z.record(z.string(), z.any()),
                    affordances: z.array(z.string()),
                    label: z.string(),
                }),
                z.object({
                    kind: z.literal("object"),
                    id: z.string(),
                    class: z.string(),
                    model: z.union([z.string(), z.null()]).optional(),
                    attributes: z.record(z.string(), z.any()),
                    affordances: z.array(z.string()),
                    label: z.string(),
                }),
            ]),
        ),
    }),
});

// export type HumAIneEnvironmentData = z.infer<
//     typeof HumAIneEnvironmentDataSchema
// >;
