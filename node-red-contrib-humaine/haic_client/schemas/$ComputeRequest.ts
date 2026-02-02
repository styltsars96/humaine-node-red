/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ComputeRequest = {
    properties: {
        decisions: {
            type: 'array',
            contains: {
                type: 'Decision',
            },
            isRequired: true,
        },
        rt_max: {
            type: 'number',
            description: `Upper cap for reaction-time scaling (sec) used by HCL`,
        },
        baseline_s: {
            type: 'any-of',
            description: `Baseline duration for EL (efficiency/latency)`,
            contains: [{
                type: 'number',
            }, {
                type: 'null',
            }],
        },
    },
} as const;
