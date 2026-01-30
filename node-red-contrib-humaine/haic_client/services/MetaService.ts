/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MetaService {
    /**
     * Health
     * @returns any Successful Response
     * @throws ApiError
     */
    public static healthMetaHealthGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/meta/health',
        });
    }
    /**
     * Version
     * @returns any Successful Response
     * @throws ApiError
     */
    public static versionMetaVersionGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/meta/version',
        });
    }
    /**
     * Seed Core Metrics
     * @returns any Successful Response
     * @throws ApiError
     */
    public static seedCoreMetricsMetaSeedCoreMetricsPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/meta/seed/core-metrics',
        });
    }
}
