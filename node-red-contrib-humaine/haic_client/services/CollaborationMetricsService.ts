/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CollabMetricsResponse } from '../models/CollabMetricsResponse';
import type { ComputeRequest } from '../models/ComputeRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CollaborationMetricsService {
    /**
     * Compute
     * @param requestBody
     * @returns CollabMetricsResponse Successful Response
     * @throws ApiError
     */
    public static computeApiV1CollabMetricsCollabComputePost(
        requestBody: ComputeRequest,
    ): CancelablePromise<CollabMetricsResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/collab-metrics/collab/compute',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Compute From Artifact
     * @param file metrics*.json
     * @returns CollabMetricsResponse Successful Response
     * @throws ApiError
     */
    public static computeFromArtifactApiV1CollabMetricsCollabFromArtifactPost(
        file: string,
    ): CancelablePromise<CollabMetricsResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/collab-metrics/collab/from-artifact',
            query: {
                'file': file,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Compute From Run
     * @param runId
     * @param rtMax Upper cap for HCL scaling (sec)
     * @param baselineS Baseline for EL
     * @returns CollabMetricsResponse Successful Response
     * @throws ApiError
     */
    public static computeFromRunApiV1CollabMetricsCollabFromRunRunIdPost(
        runId: string,
        rtMax: number = 5,
        baselineS?: (number | null),
    ): CancelablePromise<CollabMetricsResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/collab-metrics/collab/from-run/{run_id}',
            path: {
                'run_id': runId,
            },
            query: {
                'rt_max': rtMax,
                'baseline_s': baselineS,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
