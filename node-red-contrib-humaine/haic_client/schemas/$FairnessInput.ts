/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $FairnessInput = {
    properties: {
        predictions: {
            type: 'array',
            contains: {
                type: 'number',
            },
            isRequired: true,
        },
        labels: {
            type: 'array',
            contains: {
                type: 'number',
            },
            isRequired: true,
        },
        sensitive_features: {
            type: 'dictionary',
            contains: {
                type: 'array',
                contains: {
                    type: 'string',
                },
            },
            isRequired: true,
        },
    },
} as const;
