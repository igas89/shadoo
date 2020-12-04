export const color = {
    white: "\x1b[37m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    сyan: "\x1b[36m",
};

export const sleep = (timeout: number = 0): Promise<any> => new Promise((res, rej) => setTimeout(res, timeout));

export interface GetRequestData {
    body: {};
    query: {};
}
export const getRequestData = (request: GetRequestData): Record<string, unknown> => {
    return Object.keys(request.body).length ? request.body : request.query || {};
};