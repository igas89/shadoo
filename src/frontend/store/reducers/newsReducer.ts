import { ActionTypes, InitialState } from './types';
import { NEWS_REQUEST, NEWS_SUCCESS, NEWS_FAILURE, NewsRequestProps } from 'actions/newsActions';

import { NewsDataResponse } from 'types/handlers';
export interface NewsData {
    data: NewsDataResponse[];
    counts: number;
    pages: number;
}

export type NewsState = InitialState<NewsRequestProps | null | undefined, Partial<NewsData>>;

const NEWS_INITIAL_STATE: NewsState = {
    action: null,
    error: {
        code: null,
        message: null,
    },
    request_data: null,
    response_data: {},
};

export const newsReducer = (state = NEWS_INITIAL_STATE, action: ActionTypes<NewsRequestProps, NewsData>): NewsState => {
    switch (action.type) {
        case NEWS_REQUEST: {
            return {
                ...state,
                action: action.type,
                error: NEWS_INITIAL_STATE.error,
                request_data: action.payload || null,
            };
        }
        case NEWS_SUCCESS: {
            return {
                ...state,
                action: action.type,
                response_data: action.response || {},
            };
        }
        case NEWS_FAILURE: {
            return {
                ...state,
                action: action.type,
                error: action.error || NEWS_INITIAL_STATE.error,
                response_data: {},
            };
        }
        default:
            return state;
    }
};
