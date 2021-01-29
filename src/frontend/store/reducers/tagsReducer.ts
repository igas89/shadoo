import { TAGS_REQUEST, TAGS_SUCCESS, TAGS_FAILURE, TagsRequestProps } from 'actions/tagsActions';
import { ActionTypes, InitialState } from './types';

export interface TagsData {
    data: {
        id: number;
        title: string;
        description: string;
    }[];
}

export type TagsState = InitialState<TagsRequestProps | null | undefined, Partial<TagsData>>;

const TAGS_INITIAL_STATE: TagsState = {
    action: null,
    error: {
        code: null,
        message: null,
    },
    request_data: null,
    response_data: {},
};

export const tagsReducer = (state = TAGS_INITIAL_STATE, action: ActionTypes<TagsRequestProps, TagsData>): TagsState => {
    switch (action.type) {
        case TAGS_REQUEST: {
            return {
                ...state,
                action: action.type,
                error: TAGS_INITIAL_STATE.error,
                request_data: action.payload || null,
            };
        }
        case TAGS_SUCCESS: {
            return {
                ...state,
                action: action.type,
                request_data: null,
                response_data: action.response || {},
            };
        }
        case TAGS_FAILURE: {
            return {
                ...state,
                action: action.type,
                error: action.error || TAGS_INITIAL_STATE.error,
                request_data: null,
                response_data: {},
            };
        }
        default:
            return state;
    }
};
