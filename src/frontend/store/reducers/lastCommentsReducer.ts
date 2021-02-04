import {
    LAST_COMMENTS_REQUEST,
    LAST_COMMENTS_SUCCESS,
    LAST_COMMENTS_FAILURE,
    LastCommentsRequestProps,
} from 'actions/lastCommentsActions';
import { StorageResponseLastComments } from 'types/storage';
import { ActionTypes, InitialState } from './types';

export interface LastCommentsData {
    counts: number;
    data: StorageResponseLastComments[];
}

export type LastCommentsState = InitialState<LastCommentsRequestProps | null | undefined, Partial<LastCommentsData>>;

const LAST_COMMENTS_INITIAL_STATE: LastCommentsState = {
    action: null,
    error: {
        code: null,
        message: null,
    },
    request_data: null,
    response_data: {},
};

export const lastCommentsReducer = (
    state = LAST_COMMENTS_INITIAL_STATE,
    action: ActionTypes<LastCommentsRequestProps, LastCommentsData>,
): LastCommentsState => {
    switch (action.type) {
        case LAST_COMMENTS_REQUEST: {
            return {
                ...state,
                action: action.type,
                error: LAST_COMMENTS_INITIAL_STATE.error,
                request_data: action.payload || null,
            };
        }
        case LAST_COMMENTS_SUCCESS: {
            return {
                ...state,
                action: action.type,
                response_data: action.response || {},
            };
        }
        case LAST_COMMENTS_FAILURE: {
            return {
                ...state,
                action: action.type,
                error: action.error || LAST_COMMENTS_INITIAL_STATE.error,
                request_data: null,
                response_data: {},
            };
        }
        default:
            return state;
    }
};
