/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ConfigRequest = {
    properties: {
        task_name: {
            type: 'string',
            description: `Scenario name`,
            isRequired: true,
        },
        task_description: {
            type: 'any-of',
            description: `Optional task description`,
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
        },
        task_parameters: {
            type: 'dictionary',
            contains: {
                properties: {
                },
            },
        },
        agent_definitions: {
            type: 'array',
            contains: {
                type: 'dictionary',
                contains: {
                    properties: {
                    },
                },
            },
        },
        profile_definitions: {
            type: 'array',
            contains: {
                type: 'dictionary',
                contains: {
                    properties: {
                    },
                },
            },
        },
        filename: {
            type: 'any-of',
            description: `Optional file name or path (absolute under project root, repo-relative, or bare). Defaults to haic_env_builder/configs/<task>_env.yaml.`,
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
        },
    },
} as const;
