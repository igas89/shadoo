import { all } from 'redux-saga/effects';
import { watchFetchNewsSaga } from 'actions/newsActions';

export default function* rootSaga() {
    yield all([
        watchFetchNewsSaga(),
    ])
}