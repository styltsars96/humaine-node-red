/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CollabMetricsResponse = {
    properties: {
        version: {
            type: 'string',
        },
        metrics_version: {
            type: 'string',
        },
        source: {
            type: 'string',
            isRequired: true,
        },
        params: {
            type: 'dictionary',
            contains: {
                type: 'any-of',
                contains: [{
                    type: 'number',
                }, {
                    type: 'null',
                }],
            },
            isRequired: true,
        },
        metrics: {
            type: 'MetricsOut',
            isRequired: true,
        },
        by_agent: {
            type: 'array',
            contains: {
                type: 'PerAgentMetrics',
            },
        },
    },
} as const;
