export type ErrorResponse = {
    status: number,
    body: { error: string },
};

export type SuccessResponse<T> = {
    status: 200,
    body: T,
    headers?: { [key: string]: string },
    isRaw?: boolean
};

export type HttpResponse<T> = ErrorResponse | SuccessResponse<T>;

export function err(status: number, message: string): ErrorResponse {
    return {
        status,
        body: { error: message }
    };
}

export function raw<T>(data: T): SuccessResponse<T> {
    return {
        status: 200,
        headers: {
            'content-type': 'application/x-ndjson'
        },
        isRaw: true,
        body: data
    };
}
