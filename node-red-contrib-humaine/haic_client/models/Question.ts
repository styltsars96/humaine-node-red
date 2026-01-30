/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LikertScale } from './LikertScale';
export type Question = {
    /**
     * Stable identifier; also used as CSV column
     */
    id: string;
    label: string;
    type: string;
    required?: boolean;
    group?: (string | null);
    scale?: (LikertScale | null);
    options?: (Array<string> | null);
};

