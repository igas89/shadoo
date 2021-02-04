import { takeEvery } from 'redux-saga/effects';

import { apiAxios } from 'api';
import { ActionSaga } from 'actions/types';

export const AUTH_REQUEST = 'AUTH_REQUEST';
export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const AUTH_FAILURE = 'AUTH_FAILURE';

export type ActionAuth = ActionSaga<null>;

export const watchFetchAuthSaga = function* () {
    yield takeEvery(AUTH_REQUEST, apiAxios.initialApi<null>({
        actions: [AUTH_SUCCESS, AUTH_FAILURE],
        endpoint: '/v1/auth',
        method: 'POST',
        withToken: false,
    }));
};

export const getAuthType = (): ActionAuth => ({
    type: AUTH_REQUEST,
});
