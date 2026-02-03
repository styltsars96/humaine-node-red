export interface HaicConfigOptions {
    baseUrl?: string;
    username?: string;
    withCredentials?: boolean;
    headers?: string;
}

export interface HaicConfigCredentials {
    token?: unknown;
    password?: unknown;
}
