import { call, put, takeEvery } from 'redux-saga/effects';
import Api from 'api';

export const NEWS_REQUEST = 'NEWS_REQUEST';
export const NEWS_SUCCESS = 'NEWS_SUCCESS';
export const NEWS_FAILURE = 'NEWS_FAILURE';

export const fecthNewsSaga = function* (action: any) {
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

export interface FetchNewsProps {
    start: number | string;
    end: number | string;
};

export const getNewsType = (payload: FetchNewsProps) => ({
    type: NEWS_REQUEST,
    payload,
})