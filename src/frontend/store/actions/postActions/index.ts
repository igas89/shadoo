import { call, put, takeEvery } from 'redux-saga/effects';

import Api from 'api';
import { ActionSaga } from 'actions/types';
import { getToken } from 'helpers/common';

export const POST_REQUEST = 'POST_REQUEST';
export const POST_SUCCESS = 'POST_SUCCESS';
export const POST_FAILURE = 'POST_FAILURE';

export interface PostRequestProps {
    id: string;
};

export type ActionPost = ActionSaga<PostRequestProps>;

export const fetchPostSaga = function* (action: ActionPost) {
    try {
        const token = yield getToken();
        const result = yield call(Api, {
            endpoint: '/v1/post',
            method: 'GET',
            params: action.payload,
            token,
        });

        if (result.error) {
            throw ({ ...result.error });
        }

        yield put({ type: POST_SUCCESS, response: result });
    } catch (error) {
        yield put({ type: POST_FAILURE, error });
    }
}

export const watchFetchPostSaga = function* () {
    yield takeEvery(POST_REQUEST, fetchPostSaga);
}

export const getPostType = (payload: PostRequestProps): ActionPost => ({
    type: POST_REQUEST,
    payload,
})