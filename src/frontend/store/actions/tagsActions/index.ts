import { call, put, takeEvery } from 'redux-saga/effects';

import Api from 'api';
import { ActionSaga } from 'actions/types';
import { PostData } from 'reducers/postReducer';
import { getToken } from 'helpers/common';

export const TAGS_REQUEST = 'TAGS_REQUEST';
export const TAGS_SUCCESS = 'TAGS_SUCCESS';
export const TAGS_FAILURE = 'TAGS_FAILURE';

export type TagsRequestProps = number;

export type ActionTags = ActionSaga<TagsRequestProps>;

export const fetchTagsSaga = function* (action: ActionTags) {
    try {
        const token: string = yield getToken();
        const result: PostData = yield call(Api, {
            endpoint: '/v1/tags',
            method: 'GET',
            params: action.payload,
            token,
        });

        yield put({ type: TAGS_SUCCESS, response: result });
    } catch (error) {
        yield put({ type: TAGS_FAILURE, error });
    }
};

export const watchFetchTagsSaga = function* () {
    yield takeEvery(TAGS_REQUEST, fetchTagsSaga);
};

export const getTagsType = (payload?: TagsRequestProps): ActionTags => ({
    type: TAGS_REQUEST,
    payload,
});
