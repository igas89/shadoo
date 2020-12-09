import { all } from 'redux-saga/effects';
import { watchFetchNewsSaga } from 'actions/newsActions';
import { watchFetchPostSaga } from 'actions/postActions';
import { watchUpdateNewsSaga } from 'actions/updateNewsActions';

export default function* rootSaga() {
    yield all([
        watchFetchNewsSaga(),
        watchFetchPostSaga(),
        watchUpdateNewsSaga(),
    ])
}