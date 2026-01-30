/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SurveyQuestionSetIn } from '../models/SurveyQuestionSetIn';
import type { SurveyQuestionSetOut } from '../models/SurveyQuestionSetOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SurveySchemasService {
    /**
     * Create Schema Route
     * @param requestBody
     * @returns SurveyQuestionSetOut Successful Response
     * @throws ApiError
     */
    public static createSchemaRouteApiV1SurveySchemasPost(
        requestBody: SurveyQuestionSetIn,
    ): CancelablePromise<SurveyQuestionSetOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/survey/schemas',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Latest For Pilot
     * @param pilotTag
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getLatestForPilotApiV1SurveySchemasGet(
        pilotTag: string,
    ): CancelablePromise<(SurveyQuestionSetOut | null)> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/survey/schemas',
            query: {
                'pilot_tag': pilotTag,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Schema
     * @param schemaId
     * @returns SurveyQuestionSetOut Successful Response
     * @throws ApiError
     */
    public static getSchemaApiV1SurveySchemasSchemaIdGet(
        schemaId: string,
    ): CancelablePromise<SurveyQuestionSetOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/survey/schemas/{schema_id}',
            path: {
                'schema_id': schemaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
