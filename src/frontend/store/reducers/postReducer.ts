import { POST_REQUEST, POST_SUCCESS, POST_FAILURE, PostRequestProps } from 'actions/postActions';
import { PostDataResponse } from 'types/handlers';
import { ActionTypes, InitialState } from './types';

export interface PostData {
    data: PostDataResponse[];
}

export type PostState = InitialState<PostRequestProps | null | undefined, Partial<PostData>>;

const POST_INITIAL_STATE: PostState = {
    action: null,
    error: {
        code: null,
        message: null,
    },
    request_data: null,
    response_data: {},
};

export const postReducer = (state = POST_INITIAL_STATE, action: ActionTypes<PostRequestProps, PostData>): PostState => {
    switch (action.type) {
        case POST_REQUEST: {
            return {
                ...state,
                action: action.type,
                error: POST_INITIAL_STATE.error,
                request_data: action.payload || null,
            };
        }
        case POST_SUCCESS: {
            return {
                ...state,
                action: action.type,
                request_data: null,
                response_data: action.response || {},
            };
        }
        case POST_FAILURE: {
            return {
                ...state,
                action: action.type,
                error: action.error || POST_INITIAL_STATE.error,
                request_data: null,
                response_data: {},
            };
        }
        default:
            return state;
    }
};
