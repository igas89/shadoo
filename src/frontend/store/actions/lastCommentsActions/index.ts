import { takeEvery } from 'redux-saga/effects';

import { apiAxios } from 'api';
import { ActionSaga } from 'actions/types';

export const LAST_COMMENTS_REQUEST = 'LAST_COMMENTS_REQUEST';
export const LAST_COMMENTS_SUCCESS = 'LAST_COMMENTS_SUCCESS';
export const LAST_COMMENTS_FAILURE = 'LAST_COMMENTS_FAILURE';

export interface LastCommentsRequestProps {
    limit: number | string;
}

export type ActionPost = ActionSaga<LastCommentsRequestProps>;

export const watchFetchLastCommentsSaga = function* () {
    yield takeEvery(LAST_COMMENTS_REQUEST, apiAxios.initialApi({
        actions: [LAST_COMMENTS_SUCCESS, LAST_COMMENTS_FAILURE],
        endpoint: '/v1/lastComments',
        method: 'GET',
    }));
};

export const getLastCommentsType = (payload: LastCommentsRequestProps): ActionPost => ({
    type: LAST_COMMENTS_REQUEST,
    payload,
});
