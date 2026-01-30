/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ConfigRequest = {
    /**
     * Scenario name
     */
    task_name: string;
    /**
     * Optional task description
     */
    task_description?: (string | null);
    task_parameters?: Record<string, any>;
    agent_definitions?: Array<Record<string, any>>;
    profile_definitions?: Array<Record<string, any>>;
    /**
     * Optional file name or path (absolute under project root, repo-relative, or bare). Defaults to haic_env_builder/configs/<task>_env.yaml.
     */
    filename?: (string | null);
};

