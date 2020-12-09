import { ActionTypes, InitialState } from './types';
import {
    UPDATE_NEWS_REQUEST,
    UPDATE_NEWS_SUCCESS,
    UPDATE_NEWS_FAILURE,

} from 'actions/updateNewsActions';

export interface NewsData {
    data: {
        author: string;
        avatar: string;
        content: string;
        date: string;
        description: string
        descriptionImage: string
        id: number;
        image: string;
        page: number;
        title: string;
        url: string;
    }[];
    counts: number;
    pages: number;
};

export type UpdateNewsState = InitialState<null, Partial<NewsData>>;

const UPDATE_NEWS_INITIAL_STATE: UpdateNewsState = {
    action: null,
    error: null,
    request_data: null,
    response_data: {},
}

export const updateNewsReducer = (
    state = UPDATE_NEWS_INITIAL_STATE,
    action: ActionTypes<null, NewsData>
): UpdateNewsState => {
    switch (action.type) {
        case UPDATE_NEWS_REQUEST: {
            return {
                ...state,
                action: action.type,
                error: null,
                request_data: null,
            }
        }
        case UPDATE_NEWS_SUCCESS: {
            return {
                ...state,
                action: action.type,
                error: null,
                request_data: null,
                response_data: action.response || {},
            }
        }
        case UPDATE_NEWS_FAILURE: {
            return {
                ...state,
                action: action.type,
                error: action.error,
                request_data: null,
                response_data: {},
            }
        }
        default:
            return state;
    }
}