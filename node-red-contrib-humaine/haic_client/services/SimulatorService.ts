/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SimulationEnvelope } from '../models/SimulationEnvelope';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SimulatorService {
    /**
     * Run a simulation using a stored YAML config
     * Executes the environment defined in a YAML config and returns decisions + metrics.
     * @param name YAML config name or path
     * @param seed Optional seed for reproducibility
     * @returns SimulationEnvelope Successful Response
     * @throws ApiError
     */
    public static simulateApiV1SimulatorSimulatePost(
        name: string,
        seed?: (number | null),
    ): CancelablePromise<SimulationEnvelope> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/simulator/simulate',
            query: {
                'name': name,
                'seed': seed,
            },
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Runs
     * @returns any Successful Response
     * @throws ApiError
     */
    public static listRunsApiV1SimulatorRunsGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/simulator/runs',
        });
    }
    /**
     * Load metrics from a simulation run
     * Fetches and returns the metrics stored in a specified JSON file.
     * @param file
     * @returns any Successful Response
     * @throws ApiError
     */
    public static loadRunApiV1SimulatorRunsFileGet(
        file: string,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/simulator/runs/{file}',
            path: {
                'file': file,
            },
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * List simulation run files filtered by task name
     * Returns a list of JSON files whose names start with the specified task name or prefix (case-insensitive).
     * @param prefix Task name/prefix (case-insensitive)
     * @returns any Successful Response
     * @throws ApiError
     */
    public static listRunsByTaskApiV1SimulatorRunsByTaskGet(
        prefix: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/simulator/runs_by_task',
            query: {
                'prefix': prefix,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
