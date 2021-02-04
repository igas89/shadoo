import { takeEvery } from 'redux-saga/effects';

import { apiAxios } from 'api';
import { ActionSaga } from 'actions/types';

export const NEWS_REQUEST = 'NEWS_REQUEST';
export const NEWS_SUCCESS = 'NEWS_SUCCESS';
export const NEWS_FAILURE = 'NEWS_FAILURE';

export interface NewsRequestProps {
    page: number;
    tag?: string | number;
}

export type ActionNews = ActionSaga<NewsRequestProps>;

export const watchFetchNewsSaga = function* () {
    yield takeEvery(NEWS_REQUEST, apiAxios.initialApi({
        actions: [NEWS_SUCCESS, NEWS_FAILURE],
        endpoint: '/v1/news',
        method: 'GET',
    }));
};

export const getNewsType = (payload: NewsRequestProps): ActionNews => ({
    type: NEWS_REQUEST,
    payload,
});