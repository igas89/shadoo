import { takeEvery } from 'redux-saga/effects';

import { apiAxios } from 'api';
import { ActionSaga } from 'actions/types';

export const UPDATE_NEWS_REQUEST = 'UPDATE_NEWS_REQUEST';
export const UPDATE_NEWS_SUCCESS = 'UPDATE_NEWS_SUCCESS';
export const UPDATE_NEWS_FAILURE = 'UPDATE_NEWS_FAILURE';

export type ActionUpdateNews = ActionSaga<null>;

export const watchUpdateNewsSaga = function* () {
    yield takeEvery(UPDATE_NEWS_REQUEST, apiAxios.initialApi({
        actions: [UPDATE_NEWS_SUCCESS, UPDATE_NEWS_FAILURE],
        endpoint: '/v1/update',
        method: 'POST',
    }));
};

export const getUpdateNewsType = (): ActionUpdateNews => ({
    type: UPDATE_NEWS_REQUEST,
});
