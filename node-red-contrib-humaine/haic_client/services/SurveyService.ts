/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SurveyCreate } from '../models/SurveyCreate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SurveyService {
    /**
     * Submit a survey response
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static submitSurveyApiV1SurveyPost(
        requestBody: SurveyCreate,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/survey',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get aggregated survey metrics
     * @param pilotTag
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getAggregatedMetricsApiV1SurveyAggregateGet(
        pilotTag?: (string | null),
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/survey/aggregate',
            query: {
                'pilot_tag': pilotTag,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List app versions that have surveys for a pilot
     * @param pilotTag
     * @returns string Successful Response
     * @throws ApiError
     */
    public static listVersionsForPilotApiV1SurveyVersionsGet(
        pilotTag: string,
    ): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/survey/versions',
            query: {
                'pilot_tag': pilotTag,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Aggregated metrics for a single pilot/version
     * Returns: { pilot_tag, app_version, avg_sus, avg_ethics, count }
     * @param pilotTag
     * @param appVersion
     * @returns any Successful Response
     * @throws ApiError
     */
    public static versionSummaryApiV1SurveySummaryGet(
        pilotTag: string,
        appVersion: string,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/survey/summary',
            query: {
                'pilot_tag': pilotTag,
                'app_version': appVersion,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Compare two versions for a pilot
     * Returns:
     * {
         * "A": { pilot_tag, app_version, avg_sus, avg_ethics, count },
         * "B": { pilot_tag, app_version, avg_sus, avg_ethics, count }
         * }
         * @param pilotTag
         * @param versionA
         * @param versionB
         * @returns any Successful Response
         * @throws ApiError
         */
        public static compareVersionsApiV1SurveyCompareGet(
            pilotTag: string,
            versionA: string,
            versionB: string,
        ): CancelablePromise<Record<string, any>> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/survey/compare',
                query: {
                    'pilot_tag': pilotTag,
                    'version_a': versionA,
                    'version_b': versionB,
                },
                errors: {
                    422: `Validation Error`,
                },
            });
        }
        /**
         * Question Averages Route
         * @param pilotTag
         * @param appVersion
         * @returns any Successful Response
         * @throws ApiError
         */
        public static questionAveragesRouteApiV1SurveyQuestionAveragesGet(
            pilotTag: string,
            appVersion: string,
        ): CancelablePromise<any> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/survey/question-averages',
                query: {
                    'pilot_tag': pilotTag,
                    'app_version': appVersion,
                },
                errors: {
                    422: `Validation Error`,
                },
            });
        }
    }
