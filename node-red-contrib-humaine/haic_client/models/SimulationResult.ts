/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SimulationResult = {
    task: string;
    agents: Array<string>;
    profiles: Array<string>;
    metrics: Record<string, number>;
    decisions: Array<Record<string, any>>;
    status: string;
    seed?: (number | null);
    config_hash?: (string | null);
    log_path?: (string | null);
};

