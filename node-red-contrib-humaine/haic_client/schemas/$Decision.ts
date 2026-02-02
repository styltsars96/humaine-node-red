/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Decision = {
    properties: {
        't': {
            type: 'number',
            description: `Event timestamp (sec, monotonic within a session)`,
            isRequired: true,
        },
        agent: {
            type: 'any-of',
            description: `Agent/human identifier`,
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
        },
        actor_type: {
            type: 'any-of',
            description: `'human' | 'ai' (used by HCL, per-agent stats)`,
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
        },
        action: {
            type: 'any-of',
            description: `Free-text action label`,
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
        },
        duration_s: {
            type: 'any-of',
            description: `Action duration (sec)`,
            contains: [{
                type: 'number',
            }, {
                type: 'null',
            }],
        },
        latency_ms: {
            type: 'any-of',
            description: `Alternative latency (ms) if duration_s missing`,
            contains: [{
                type: 'number',
            }, {
                type: 'null',
            }],
        },
        correct: {
            type: 'any-of',
            description: `Outcome for Tr/A (True/False)`,
            contains: [{
                type: 'boolean',
            }, {
                type: 'null',
            }],
        },
        probs: {
            type: 'any-of',
            description: `Primary/human prob. distribution over classes`,
            contains: [{
                type: 'dictionary',
                contains: {
                    type: 'number',
                },
            }, {
                type: 'null',
            }],
        },
        surrogate_probs: {
            type: 'any-of',
            description: `Surrogate model prob. distribution`,
            contains: [{
                type: 'dictionary',
                contains: {
                    type: 'number',
                },
            }, {
                type: 'null',
            }],
        },
        surrogate_action: {
            type: 'any-of',
            description: `Fallback if no probs; compare with action`,
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
        },
        event_type: {
            type: 'any-of',
            description: `Optional: e.g., 'error' marks an error event`,
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
        },
    },
} as const;
