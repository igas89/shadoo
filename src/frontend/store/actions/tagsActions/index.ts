import { takeEvery } from 'redux-saga/effects';

import { apiAxios } from 'api';
import { ActionSaga } from 'actions/types';

export const TAGS_REQUEST = 'TAGS_REQUEST';
export const TAGS_SUCCESS = 'TAGS_SUCCESS';
export const TAGS_FAILURE = 'TAGS_FAILURE';

export type TagsRequestProps = number;

export type ActionTags = ActionSaga<TagsRequestProps>;

export const watchFetchTagsSaga = function* () {
    yield takeEvery(TAGS_REQUEST, apiAxios.initialApi({
        actions: [TAGS_SUCCESS, TAGS_FAILURE],
        endpoint: '/v1/tags',
        method: 'GET',
    }));
};

export const getTagsType = (payload?: TagsRequestProps): ActionTags => ({
    type: TAGS_REQUEST,
    payload,
});
