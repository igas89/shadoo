import { call, put, takeEvery } from 'redux-saga/effects';

import Api from 'api';
import { ActionSaga } from 'actions/types';
import { LastCommentsData } from 'reducers/lastCommentsReducer';
import { getToken } from 'helpers/common';

export const LAST_COMMENTS_REQUEST = 'LAST_COMMENTS_REQUEST';
export const LAST_COMMENTS_SUCCESS = 'LAST_COMMENTS_SUCCESS';
export const LAST_COMMENTS_FAILURE = 'LAST_COMMENTS_FAILURE';

export interface LastCommentsRequestProps {
    limit: number | string;
}

export type ActionPost = ActionSaga<LastCommentsRequestProps>;

export const fetchLastCommentsSaga = function* (action: ActionPost) {
    try {
        const token: string = yield getToken();
        const result: LastCommentsData = yield call(Api, {
            endpoint: '/v1/lastComments',
            method: 'GET',
            params: action.payload,
            token,
        });

        yield put({ type: LAST_COMMENTS_SUCCESS, response: result });
    } catch (error) {
        yield put({ type: LAST_COMMENTS_FAILURE, error });
    }
};

export const watchFetchLastCommentsSaga = function* () {
    yield takeEvery(LAST_COMMENTS_REQUEST, fetchLastCommentsSaga);
};

export const getLastCommentsType = (payload: LastCommentsRequestProps): ActionPost => ({
    type: LAST_COMMENTS_REQUEST,
    payload,
});
