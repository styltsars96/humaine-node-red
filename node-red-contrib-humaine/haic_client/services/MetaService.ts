/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class MetaService {
    /**
     * Health
     * @returns any Successful Response
     * @throws ApiError
     */
    public static healthMetaHealthGet(
        openAPI = OpenAPI,
    ): CancelablePromise<any> {
        return __request(openAPI, {
            method: "GET",
            url: "/meta/health",
        });
    }
    /**
     * Version
     * @returns any Successful Response
     * @throws ApiError
     */
    public static versionMetaVersionGet(
        openAPI = OpenAPI,
    ): CancelablePromise<any> {
        return __request(openAPI, {
            method: "GET",
            url: "/meta/version",
        });
    }
    /**
     * Seed Core Metrics
     * @returns any Successful Response
     * @throws ApiError
     */
    public static seedCoreMetricsMetaSeedCoreMetricsPost(
        openAPI = OpenAPI,
    ): CancelablePromise<any> {
        return __request(openAPI, {
            method: "POST",
            url: "/meta/seed/core-metrics",
        });
    }
}
