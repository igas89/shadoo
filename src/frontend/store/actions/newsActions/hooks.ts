import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { actionDispatch, RootState, UseActionHandlers } from 'store';

import {
    NEWS_REQUEST,
    NEWS_SUCCESS,
    NEWS_FAILURE,
    getNewsType,
    FetchNewsProps,
} from './index';

import { NewsState } from 'reducers/newsReducer';
export interface UseNews {
    fecthNews: (props: FetchNewsProps) => void;
    newsState: NewsState;
}

export const useNews = <T extends UseActionHandlers<NewsState>>(handlers?: T): UseNews => {
    const state = useSelector<RootState, NewsState>(({ newsState }) => newsState);

    const fecthNews = useCallback((props: FetchNewsProps) => {
        actionDispatch(getNewsType(props));
    }, []);

    useEffect(() => {
        if (state.action === NEWS_REQUEST && handlers?.onRequest && typeof handlers.onRequest === 'function') {
            handlers.onRequest(state);
        }

        if (state.action === NEWS_SUCCESS && handlers?.onDone && typeof handlers.onDone === 'function') {
            handlers.onDone(state);
        }

        if (state.action === NEWS_FAILURE && handlers?.onError && typeof handlers.onError === 'function') {
            handlers.onError(state);
        }
    }, [state, handlers]);

    return {
        fecthNews,
        newsState: state,
    }
}