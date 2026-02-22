export type ServerActionResponse<T> = Promise<ServerActionResponseSuccess<T> | ServerActionResponseFailure>;

export interface ServerActionResponseSuccess<T> {
    success: true;
    value: T;
}

export interface ServerActionResponseFailure {
    success: false;
    error: Error;
}