import { all } from 'redux-saga/effects';
import { watchFetchNewsSaga } from 'actions/newsActions';
import { watchFetchPostSaga } from 'actions/postActions';

export default function* rootSaga() {
    yield all([
        watchFetchNewsSaga(),
        watchFetchPostSaga(),
    ])
}