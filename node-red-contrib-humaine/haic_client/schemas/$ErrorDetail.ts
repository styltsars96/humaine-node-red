/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ErrorDetail = {
    properties: {
        code: {
            type: 'string',
            isRequired: true,
        },
        message: {
            type: 'string',
            isRequired: true,
        },
        details: {
            type: 'dictionary',
            contains: {
                properties: {
                },
            },
        },
    },
} as const;
