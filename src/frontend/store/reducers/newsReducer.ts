import { ActionTypes, InitialState } from './types';
import {
    NEWS_REQUEST,
    NEWS_SUCCESS,
    NEWS_FAILURE,
} from 'actions/newsActions';

export interface NewsRequest {
    start: number;
    end: number;
}

export interface NewsData {
    data: {
        author: string;
        avatar: string;
        content: string;
        date: string;
        description: string
        id: number;
        image: string;
        page: number;
        title: string;
        url: string;
    }[];
    counts: number;
    pages: number;
};

export type NewsState = InitialState<NewsRequest | null | undefined, Partial<NewsData>>;

const NEWS_INITIAL_STATE: NewsState = {
    action: null,
    error: null,
    request_data: null,
    response_data: {},
}

export const newsReducer = (
    state = NEWS_INITIAL_STATE,
    action: ActionTypes<NewsRequest>
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
                request_data: null,
                response_data: action.response || {},
            }
        }
        case NEWS_FAILURE: {
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