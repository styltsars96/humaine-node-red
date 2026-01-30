/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LogGeneratorService {
    /**
     * Generate Log Endpoint
     * Returns an array of *adapter-ready* session logs.
     * Use /download to fetch a file if you need one.
     * @param appType App type: hmi_xr | radiologist | <custom>
     * @param count Number of sessions to generate
     * @param startDate
     * @param endDate
     * @param aiModelVersionRange
     * @param rtMax Max acceptable response time (s) for HCL
     * @param baselineS Baseline task time (s) for EL
     * @param appVersion
     * @returns any Successful Response
     * @throws ApiError
     */
    public static generateLogEndpointApiV1LogGeneratorGenerateGet(
        appType: string = 'hmi_xr',
        count: number = 3,
        startDate: string = '2025-09-10T13:00:00Z',
        endDate: string = '2025-09-12T13:00:00Z',
        aiModelVersionRange: string = '1.0.0-2.0.0',
        rtMax: number = 5,
        baselineS?: number,
        appVersion: string = '1.0.0',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/log-generator/generate',
            query: {
                'app_type': appType,
                'count': count,
                'start_date': startDate,
                'end_date': endDate,
                'ai_model_version_range': aiModelVersionRange,
                'rt_max': rtMax,
                'baseline_s': baselineS,
                'app_version': appVersion,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Download Log
     * @param filePath
     * @returns any Successful Response
     * @throws ApiError
     */
    public static downloadLogApiV1LogGeneratorDownloadGet(
        filePath: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/log-generator/download',
            query: {
                'file_path': filePath,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
