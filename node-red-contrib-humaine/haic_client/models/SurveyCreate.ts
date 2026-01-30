/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EthicsResponses } from './EthicsResponses';
import type { TAMSUSResponses } from './TAMSUSResponses';
export type SurveyCreate = {
    /**
     * ID of the domain-specific question set used to render this survey
     */
    schema_id?: (string | null);
    survey_id?: string;
    /**
     * An anonymized identifier for the respondent
     */
    user_id: string;
    timestamp?: string;
    /**
     * A tag indicating from which pilot this survey is received (e.g., 'SmartTicketing', 'SmartEnergy', etc.)
     */
    pilot_tag: string;
    /**
     * Version of the pilot's application
     */
    app_version?: (string | null);
    /**
     * Version of the AI model being used
     */
    ai_model_version?: (string | null);
    tam_sus_responses: TAMSUSResponses;
    ethics_responses: EthicsResponses;
    /**
     * Optional domain-specific responses, e.g., for pilot-specific questions
     */
    domain_specific?: (Record<string, any> | null);
};

