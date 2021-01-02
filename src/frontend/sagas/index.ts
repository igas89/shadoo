import { all } from 'redux-saga/effects';

import { watchFetchAuthSaga } from 'actions/authActions';
import { watchFetchNewsSaga } from 'actions/newsActions';
import { watchFetchPostSaga } from 'actions/postActions';
import { watchUpdateNewsSaga } from 'actions/updateNewsActions';
import { watchFetchLastCommentsSaga } from 'actions/lastCommentsActions';

export default function* rootSaga() {
    yield all([
        watchFetchAuthSaga(),
        watchFetchNewsSaga(),
        watchFetchPostSaga(),
        watchUpdateNewsSaga(),
        watchFetchLastCommentsSaga(),
    ]);
}
