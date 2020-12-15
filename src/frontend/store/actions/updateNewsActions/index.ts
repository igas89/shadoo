import { call, put, takeEvery } from 'redux-saga/effects';

import Api from 'api';
import { ActionSaga } from 'actions/types';
import { getToken } from 'helpers/common';

export const UPDATE_NEWS_REQUEST = 'UPDATE_NEWS_REQUEST';
export const UPDATE_NEWS_SUCCESS = 'UPDATE_NEWS_SUCCESS';
export const UPDATE_NEWS_FAILURE = 'UPDATE_NEWS_FAILURE';

export type ActionPost = ActionSaga<never>;

export const updateNewsSaga = function* (action: ActionPost) {
    try {
        const token = yield getToken();
        const result = yield call(Api, {
            endpoint: '/v1/update',
            method: 'post',
            params: action.payload,
            token,
        });

        if (result.error) {
            throw ({ ...result.error });
        }

        yield put({ type: UPDATE_NEWS_SUCCESS, response: result });
    } catch (error) {
        yield put({ type: UPDATE_NEWS_FAILURE, error });
    }
}

export const watchUpdateNewsSaga = function* () {
    yield takeEvery(UPDATE_NEWS_REQUEST, updateNewsSaga);
}

export const getUpdateNewsType = (): ActionPost => ({
    type: UPDATE_NEWS_REQUEST,
})