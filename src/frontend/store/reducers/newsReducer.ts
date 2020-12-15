import { ActionTypes, InitialState } from './types';
import {
    NEWS_REQUEST,
    NEWS_SUCCESS,
    NEWS_FAILURE,
    NewsRequestProps,
} from 'actions/newsActions';

import { StorageResponse } from 'types/storage';
export interface NewsData {
    data: StorageResponse[];
    counts: number;
    pages: number;
};

export type NewsState = InitialState<NewsRequestProps | null | undefined, Partial<NewsData>>;

const NEWS_INITIAL_STATE: NewsState = {
    action: null,
    error: null,
    request_data: null,
    response_data: {},
}

export const newsReducer = (
    state = NEWS_INITIAL_STATE,
    action: ActionTypes<NewsRequestProps, NewsData>
): NewsState => {
    switch (action.type) {
        case NEWS_REQUEST: {
            return {
                ...state,
                action: action.type,
                error: null,
                request_data: action.payload || null,
            }
        }
        case NEWS_SUCCESS: {
            return {
                ...state,
                action: action.type,
                error: null,
                response_data: action.response || {},
            }
        }
        case NEWS_FAILURE: {
            return {
                ...state,
                action: action.type,
                error: action.error,
                response_data: {},
            }
        }
        default:
            return state;
    }
}