/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ConfigList } from "../models/ConfigList";
import type { ConfigRequest } from "../models/ConfigRequest";
import type { MessageWithPath } from "../models/MessageWithPath";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class EnvironmentBuilderService {
    /**
     * Generate and persist a scenario config YAML
     * @param requestBody
     * @returns MessageWithPath Successful Response
     * @throws ApiError
     */
    public static generateConfigApiV1EnvGenerateConfigPost(
        requestBody: ConfigRequest,
        openAPI = OpenAPI,
    ): CancelablePromise<MessageWithPath> {
        return __request(openAPI, {
            method: "POST",
            url: "/api/v1/env/generate_config",
            body: requestBody,
            mediaType: "application/json",
            errors: {
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * List available scenario configs
     * @returns ConfigList Successful Response
     * @throws ApiError
     */
    public static listConfigsApiV1EnvListConfigsGet(
        openAPI = OpenAPI,
    ): CancelablePromise<ConfigList> {
        return __request(openAPI, {
            method: "GET",
            url: "/api/v1/env/list_configs",
        });
    }
    /**
     * Load a scenario config YAML by name
     * @param name YAML filename, repo-relative path, or absolute path under project root
     * @returns any Successful Response
     * @throws ApiError
     */
    public static loadConfigApiV1EnvLoadConfigGet(
        name: string,
        openAPI = OpenAPI,
    ): CancelablePromise<any> {
        return __request(openAPI, {
            method: "GET",
            url: "/api/v1/env/load_config",
            query: {
                name: name,
            },
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
}
