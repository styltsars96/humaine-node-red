/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_upload_log_api_v1_logs_upload_post } from "../models/Body_upload_log_api_v1_logs_upload_post";
import type { LogSchema } from "../models/LogSchema";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class LogsService {
    /**
     * Upload Log
     * @param configurationId Evaluation configuration id
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static uploadLogApiV1LogsUploadPost(
        configurationId: number,
        formData: Body_upload_log_api_v1_logs_upload_post,
        openAPI = OpenAPI,
    ): CancelablePromise<any> {
        return __request(openAPI, {
            method: "POST",
            url: "/api/v1/logs/upload",
            query: {
                configuration_id: configurationId,
            },
            formData: formData,
            mediaType: "multipart/form-data",
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Register Log
     * External services send one session log here.
     * We append it to the aggregated log file in MinIO (config.minio_path).
     * If it's the first log, we create that file.
     * We also create a LogEntry row and return derived KPIs for this session.
     * @param configurationId Evaluation configuration id
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static registerLogApiV1LogsRegisterPost(
        configurationId: number,
        requestBody: LogSchema,
        openAPI = OpenAPI,
    ): CancelablePromise<Record<string, any>> {
        return __request(openAPI, {
            method: "POST",
            url: "/api/v1/logs/register",
            query: {
                configuration_id: configurationId,
            },
            body: requestBody,
            mediaType: "application/json",
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Logs
     * @param configId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static listLogsApiV1LogsConfigIdGet(
        configId: number,
        openAPI = OpenAPI,
    ): CancelablePromise<any> {
        return __request(openAPI, {
            method: "GET",
            url: "/api/v1/logs/{config_id}",
            path: {
                config_id: configId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Download Url
     * @param configId
     * @param objectKey
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getDownloadUrlApiV1LogsDownloadConfigIdGet(
        configId: number,
        objectKey: string,
        openAPI = OpenAPI,
    ): CancelablePromise<any> {
        return __request(openAPI, {
            method: "GET",
            url: "/api/v1/logs/download/{config_id}",
            path: {
                config_id: configId,
            },
            query: {
                object_key: objectKey,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Remove Log
     * @param configId
     * @param logName
     * @returns any Successful Response
     * @throws ApiError
     */
    public static removeLogApiV1LogsConfigIdLogNameDelete(
        configId: number,
        logName: string,
        openAPI = OpenAPI,
    ): CancelablePromise<any> {
        return __request(openAPI, {
            method: "DELETE",
            url: "/api/v1/logs/{config_id}/{log_name}",
            path: {
                config_id: configId,
                log_name: logName,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
