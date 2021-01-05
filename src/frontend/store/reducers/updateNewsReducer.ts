import { UPDATE_NEWS_REQUEST, UPDATE_NEWS_SUCCESS, UPDATE_NEWS_FAILURE } from 'actions/updateNewsActions';
import { StorageResponseUpdateNews } from 'types/storage';
import { ActionTypes, InitialState } from './types';

export interface UpdateNewsData {
    data: StorageResponseUpdateNews;
}

export type UpdateNewsState = InitialState<null, Partial<UpdateNewsData>>;

const UPDATE_NEWS_INITIAL_STATE: UpdateNewsState = {
    action: null,
    error: {
        code: null,
        message: null,
    },
    request_data: null,
    response_data: {},
};

export const updateNewsReducer = (
    state = UPDATE_NEWS_INITIAL_STATE,
    action: ActionTypes<null, UpdateNewsData>,
): UpdateNewsState => {
    switch (action.type) {
        case UPDATE_NEWS_REQUEST: {
            return {
                ...state,
                action: action.type,
                error: UPDATE_NEWS_INITIAL_STATE.error,
                request_data: null,
            };
        }
        case UPDATE_NEWS_SUCCESS: {
            return {
                ...state,
                action: action.type,
                error: UPDATE_NEWS_INITIAL_STATE.error,
                request_data: null,
                response_data: action.response || {},
            };
        }
        case UPDATE_NEWS_FAILURE: {
            return {
                ...state,
                action: action.type,
                error: action.error || UPDATE_NEWS_INITIAL_STATE.error,
                request_data: null,
                response_data: {},
            };
        }
        default:
            return state;
    }
};
