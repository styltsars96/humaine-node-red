/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class ResultsService {
    /**
     * Get Evaluation Results
     * @param configurationId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getEvaluationResultsApiV1ResultsConfigurationIdGet(
        configurationId: number,
        openAPI = OpenAPI,
    ): CancelablePromise<any> {
        return __request(openAPI, {
            method: "GET",
            url: "/api/v1/results/{configuration_id}",
            path: {
                configuration_id: configurationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Evaluation Result
     * @param configurationId
     * @param resultId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getEvaluationResultApiV1ResultsConfigurationIdResultIdGet(
        configurationId: number,
        resultId: number,
        openAPI = OpenAPI,
    ): CancelablePromise<any> {
        return __request(openAPI, {
            method: "GET",
            url: "/api/v1/results/{configuration_id}/{result_id}",
            path: {
                configuration_id: configurationId,
                result_id: resultId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Evaluation Results By Group
     * @param configurationId
     * @param groupName
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getEvaluationResultsByGroupApiV1ResultsConfigurationIdGroupGroupNameGet(
        configurationId: number,
        groupName: string,
        openAPI = OpenAPI,
    ): CancelablePromise<any> {
        return __request(openAPI, {
            method: "GET",
            url: "/api/v1/results/{configuration_id}/group/{group_name}",
            path: {
                configuration_id: configurationId,
                group_name: groupName,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
