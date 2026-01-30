/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MetricsOut } from './MetricsOut';
import type { PerAgentMetrics } from './PerAgentMetrics';
export type CollabMetricsResponse = {
    version?: string;
    metrics_version?: string;
    source: string;
    params: Record<string, (number | null)>;
    metrics: MetricsOut;
    by_agent?: Array<PerAgentMetrics>;
};

