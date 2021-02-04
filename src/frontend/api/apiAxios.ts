import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { call, put } from 'redux-saga/effects';

import { ActionSaga } from 'actions/types';
import { getToken } from 'helpers/common';

export interface ApiAxiosParams extends AxiosRequestConfig {
    endpoint: string;
    token?: string;
}

export interface InitialApiProps extends Omit<ApiAxiosParams, 'token'> {
    actions: string[];
    withToken?: boolean;
}

export const apiAxios = async (args: ApiAxiosParams): Promise<unknown> => {
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
        (config) => config,
        (error) => Promise.reject(error),
    );

    instance.interceptors.response.use(
        (response) => response,
        (error: AxiosError) => {

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
};

export const initialApi = <T>({ actions, withToken = true, ...rest }: InitialApiProps) =>
    function* (action: ActionSaga<T>) {
        try {
            const token: string | undefined = withToken ? yield getToken() : undefined;
            const result = yield call(apiAxios, {
                ...rest,
                params: action.payload,
                ...(withToken ? { token } : {}),
            });

            yield put({ type: actions[0], response: result });
        } catch (error) {
            yield put({ type: actions[1], error });
        }
    };