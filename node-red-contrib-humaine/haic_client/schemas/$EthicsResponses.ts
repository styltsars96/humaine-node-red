/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $EthicsResponses = {
    properties: {
        q_fairness: {
            type: 'number',
            description: `Fairness: The system handles different tasks (or users, data) without bias.`,
            isRequired: true,
            maximum: 5,
            minimum: 1,
        },
        q_transparency: {
            type: 'number',
            description: `Transparency: I understand how the system/AI arrives at its suggestions or decisions.`,
            isRequired: true,
            maximum: 5,
            minimum: 1,
        },
        q_privacy: {
            type: 'number',
            description: `Privacy: I feel confident that sensitive or personal data is protected by this system.`,
            isRequired: true,
            maximum: 5,
            minimum: 1,
        },
        q_accountability: {
            type: 'number',
            description: `Accountability: It is clear who or what is responsible if the system makes a mistake.`,
            isRequired: true,
            maximum: 5,
            minimum: 1,
        },
        q_trust: {
            type: 'number',
            description: `Trust: Overall, I trust this system to operate ethically and in my best interest.`,
            isRequired: true,
            maximum: 5,
            minimum: 1,
        },
    },
} as const;
