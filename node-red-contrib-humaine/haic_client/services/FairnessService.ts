/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FairnessInput } from '../models/FairnessInput';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FairnessService {
    /**
     * Evaluate Fairness
     * @param feature
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static evaluateFairnessApiV1FairnessEvaluatePost(
        feature: string,
        requestBody: FairnessInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/fairness/evaluate/',
            query: {
                'feature': feature,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
