import { call, put, takeEvery } from 'redux-saga/effects';

import Api from 'api';
import { ActionSaga } from 'actions/types';
import { AuthData } from 'reducers/authReducer';

export const AUTH_REQUEST = 'AUTH_REQUEST';
export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const AUTH_FAILURE = 'AUTH_FAILURE';

export type ActionAuth = ActionSaga<null>;

export const fetchAuthSaga = function* (action: ActionAuth) {
    try {
        const result: AuthData = yield call(Api, {
            endpoint: '/v1/auth',
            method: 'POST',
        });

        yield put({ type: AUTH_SUCCESS, response: result });
    } catch (error) {
        yield put({ type: AUTH_FAILURE, error });
    }
};

export const watchFetchAuthSaga = function* () {
    yield takeEvery(AUTH_REQUEST, fetchAuthSaga);
};

export const getAuthType = (): ActionAuth => ({
    type: AUTH_REQUEST,
});
