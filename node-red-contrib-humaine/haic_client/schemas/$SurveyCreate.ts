/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $SurveyCreate = {
    properties: {
        schema_id: {
            type: 'any-of',
            description: `ID of the domain-specific question set used to render this survey`,
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
        },
        survey_id: {
            type: 'string',
        },
        user_id: {
            type: 'string',
            description: `An anonymized identifier for the respondent`,
            isRequired: true,
        },
        timestamp: {
            type: 'string',
            format: 'date-time',
        },
        pilot_tag: {
            type: 'string',
            description: `A tag indicating from which pilot this survey is received (e.g., 'SmartTicketing', 'SmartEnergy', etc.)`,
            isRequired: true,
        },
        app_version: {
            type: 'any-of',
            description: `Version of the pilot's application`,
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
        },
        ai_model_version: {
            type: 'any-of',
            description: `Version of the AI model being used`,
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
        },
        tam_sus_responses: {
            type: 'TAMSUSResponses',
            isRequired: true,
        },
        ethics_responses: {
            type: 'EthicsResponses',
            isRequired: true,
        },
        domain_specific: {
            type: 'any-of',
            description: `Optional domain-specific responses, e.g., for pilot-specific questions`,
            contains: [{
                type: 'dictionary',
                contains: {
                    properties: {
                    },
                },
            }, {
                type: 'null',
            }],
        },
    },
} as const;
