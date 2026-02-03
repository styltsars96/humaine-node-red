/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EnvMeta } from "../models/EnvMeta";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class EnvironmentCatalogService {
    /**
     * List Envs
     * @returns EnvMeta Successful Response
     * @throws ApiError
     */
    public static listEnvsApiV1EnvsGet(
        openAPI = OpenAPI,
    ): CancelablePromise<Array<EnvMeta>> {
        return __request(openAPI, {
            method: "GET",
            url: "/api/v1/envs",
        });
    }
    /**
     * Get Env
     * @param envId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getEnvApiV1EnvsEnvIdGet(
        envId: string,
        openAPI = OpenAPI,
    ): CancelablePromise<any> {
        return __request(openAPI, {
            method: "GET",
            url: "/api/v1/envs/{env_id}",
            path: {
                env_id: envId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Env Blocks
     * @param envId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getEnvBlocksApiV1EnvsEnvIdBlocksGet(
        envId: string,
        openAPI = OpenAPI,
    ): CancelablePromise<any> {
        return __request(openAPI, {
            method: "GET",
            url: "/api/v1/envs/{env_id}/blocks",
            path: {
                env_id: envId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
