import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

export interface ApiParams extends AxiosRequestConfig {
    endpoint: string;
    token?: string;
}

export default async function Api(args: ApiParams): Promise<unknown> {
    const { data, endpoint, headers, token, method, params, ...rest } = args;

    const config: AxiosRequestConfig = {
        url: endpoint,
        method: method || 'GET',
        params: params || {},
        data: data || {},
        ...rest,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'x-access-token': token } : {}),
            ...(headers ?? {}),
        },
    };
    const instance: AxiosInstance = axios.create(config);

    instance.interceptors.request.use(
        (config) => {
            // console.log('interceptors request:', config);
            return config;
        },
        (error) => {
            // console.error('interceptors request [error]:', error);
            return Promise.reject(error);
        },
    );

    instance.interceptors.response.use(
        (response) => {
            // console.log('interceptors response:', response);
            return response;
        },
        (error: AxiosError) => {
            // console.error('interceptors response [error]:', error);

            // Ловим подготовленые ошибки из бэка
            if (error.response?.data.error) {
                return Promise.reject(error.response.data.error);
            }

            return Promise.reject({
                code: 404,
                message: `Ошибка в ответе ${endpoint}`,
            });
        },
    );

    const response = await instance(config);
    return response.data;
}
