/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MetricGroupResponse } from '../models/MetricGroupResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EvaluationService {
    /**
     * Evaluate Config
     * @param configurationId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static evaluateConfigApiV1EvaluateConfigurationIdPost(
        configurationId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/evaluate/{configuration_id}',
            path: {
                'configuration_id': configurationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Metrics
     * @returns MetricGroupResponse Successful Response
     * @throws ApiError
     */
    public static getMetricsApiV1EvaluateMetricsGet(): CancelablePromise<Record<string, MetricGroupResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/evaluate/metrics',
        });
    }
}
