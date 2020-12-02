import axios from 'axios';

export interface ApiParams {
    endpoint: string;
    headers?: {};
    [K: string]: any;
}

export default async function Api(args: ApiParams): Promise<unknown> {
    const { data, endpoint, headers, types, method, params, ...rest } = args;

    const response = await axios({
        url: endpoint,
        method: method || 'GET',
        params: params || {},
        data: data || {},
        ...rest,
        headers: {
            'Content-Type': 'application/json',
            ...(headers ?? {}),
        },
    });

    return response.data;
}; 