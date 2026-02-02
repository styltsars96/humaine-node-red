/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Question = {
    properties: {
        id: {
            type: 'string',
            description: `Stable identifier; also used as CSV column`,
            isRequired: true,
        },
        label: {
            type: 'string',
            isRequired: true,
        },
        type: {
            type: 'string',
            isRequired: true,
        },
        required: {
            type: 'boolean',
        },
        group: {
            type: 'any-of',
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
        },
        scale: {
            type: 'any-of',
            contains: [{
                type: 'LikertScale',
            }, {
                type: 'null',
            }],
        },
        options: {
            type: 'any-of',
            contains: [{
                type: 'array',
                contains: {
                    type: 'string',
                },
            }, {
                type: 'null',
            }],
        },
    },
} as const;
