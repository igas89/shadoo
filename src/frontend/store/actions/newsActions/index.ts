import { call, put, takeEvery } from 'redux-saga/effects';

import Api from 'api';
import { ActionSaga } from 'actions/types';
import { NewsData } from 'reducers/newsReducer';
import { getToken } from 'helpers/common';

export const NEWS_REQUEST = 'NEWS_REQUEST';
export const NEWS_SUCCESS = 'NEWS_SUCCESS';
export const NEWS_FAILURE = 'NEWS_FAILURE';

export interface NewsRequestProps {
    page: number;
    tags?: number;
}

export type ActionNews = ActionSaga<NewsRequestProps>;

export const fetchNewsSaga = function* (action: ActionNews) {
    try {
        const token: string = yield getToken();
        const result: NewsData = yield call(Api, {
            endpoint: '/v1/news',
            method: 'GET',
            params: action.payload,
            token,
        });

        yield put({ type: NEWS_SUCCESS, response: result });
    } catch (error) {
        yield put({ type: NEWS_FAILURE, error });
    }
};

export const watchFetchNewsSaga = function* () {
    yield takeEvery(NEWS_REQUEST, fetchNewsSaga);
};

export const getNewsType = (payload: NewsRequestProps): ActionNews => ({
    type: NEWS_REQUEST,
    payload,
});