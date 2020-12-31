export const color = {
    white: '\x1b[37m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
};

export const sleep = (timeout = 0): Promise<undefined> => new Promise((res) => window.setTimeout(res, timeout));

export interface GetRequestData {
    body: Record<string, unknown>;
    query: Record<string, unknown>;
}
export const getRequestData = (
    request: GetRequestData,
): Partial<GetRequestData> => Object.keys(request.body).length ? request.body : request.query || {};
