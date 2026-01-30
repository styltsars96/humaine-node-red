/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Decision } from './Decision';
export type ComputeRequest = {
    decisions: Array<Decision>;
    /**
     * Upper cap for reaction-time scaling (sec) used by HCL
     */
    rt_max?: number;
    /**
     * Baseline duration for EL (efficiency/latency)
     */
    baseline_s?: (number | null);
};

