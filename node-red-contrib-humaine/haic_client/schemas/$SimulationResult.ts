/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $SimulationResult = {
    properties: {
        task: {
            type: 'string',
            isRequired: true,
        },
        agents: {
            type: 'array',
            contains: {
                type: 'string',
            },
            isRequired: true,
        },
        profiles: {
            type: 'array',
            contains: {
                type: 'string',
            },
            isRequired: true,
        },
        metrics: {
            type: 'dictionary',
            contains: {
                type: 'number',
            },
            isRequired: true,
        },
        decisions: {
            type: 'array',
            contains: {
                type: 'dictionary',
                contains: {
                    properties: {
                    },
                },
            },
            isRequired: true,
        },
        status: {
            type: 'string',
            isRequired: true,
        },
        seed: {
            type: 'any-of',
            contains: [{
                type: 'number',
            }, {
                type: 'null',
            }],
        },
        config_hash: {
            type: 'any-of',
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
        },
        log_path: {
            type: 'any-of',
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
        },
    },
} as const;
