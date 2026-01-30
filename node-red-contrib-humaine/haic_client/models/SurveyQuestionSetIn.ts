/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Question } from './Question';
export type SurveyQuestionSetIn = {
    name?: (string | null);
    pilot_tag?: (string | null);
    version?: (number | null);
    questions: Array<Question>;
    active?: boolean;
    created_by?: (string | null);
};

