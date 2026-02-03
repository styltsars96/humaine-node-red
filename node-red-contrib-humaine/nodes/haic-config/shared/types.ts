export interface HaicConfigOptions {
    baseUrl?: string;
    username?: string;
    withCredentials?: boolean;
    headers?: string;
}

// NOTE: Specific type for credentials cannot be handled!
export interface HaicConfigCredentials {
    token?: unknown;
    password?: unknown;
}
