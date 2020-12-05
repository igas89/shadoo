import { call, put, takeEvery } from 'redux-saga/effects';

import Api from 'api';
import { ActionSaga } from 'actions/types';

export const NEWS_REQUEST = 'NEWS_REQUEST';
export const NEWS_SUCCESS = 'NEWS_SUCCESS';
export const NEWS_FAILURE = 'NEWS_FAILURE';

export interface NewsRequestProps {
    start: number;
    end: number;
};

export const fecthNewsSaga = function* (action: ActionSaga<NewsRequestProps>) {
    try {
        const result = yield call(Api, {
            endpoint: '/v1/news',
            method: 'GET',
            params: action.payload ? action.payload : {},
        });

        if (result.error) {
            throw ({ ...result.error });
        }

        yield put({ type: NEWS_SUCCESS, response: result });
    } catch (error) {
        yield put({ type: NEWS_FAILURE, error });
    }
}

export const watchFetchNewsSaga = function* () {
    yield takeEvery(NEWS_REQUEST, fecthNewsSaga);
}

export const getNewsType = (payload: NewsRequestProps) => ({
    type: NEWS_REQUEST,
    payload,
})