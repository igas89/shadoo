import { takeEvery } from 'redux-saga/effects';

import { apiAxios } from 'api';
import { ActionSaga } from 'actions/types';

export const POST_REQUEST = 'POST_REQUEST';
export const POST_SUCCESS = 'POST_SUCCESS';
export const POST_FAILURE = 'POST_FAILURE';

export interface PostRequestProps {
    id: string;
}

export type ActionPost = ActionSaga<PostRequestProps>;

export const watchFetchPostSaga = function* () {
    yield takeEvery(POST_REQUEST, apiAxios.initialApi({
        actions: [POST_SUCCESS, POST_FAILURE],
        endpoint: '/v1/post',
        method: 'GET',
    }));
};

export const getPostType = (payload: PostRequestProps): ActionPost => ({
    type: POST_REQUEST,
    payload,
});
