import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { actionDispatch, RootState, UseActionHandlers } from 'store';

import {
    UPDATE_NEWS_REQUEST,
    UPDATE_NEWS_SUCCESS,
    UPDATE_NEWS_FAILURE,
    getUpdateNewsType,
} from './index';

import { UpdateNewsState } from 'reducers/updateNewsReducer';

export interface UseUpdateNews {
    updateNews: () => void;
    updateNewsState: UpdateNewsState;
}

export const useUpdateNews = <T extends UseActionHandlers<UpdateNewsState>>(handlers?: T): UseUpdateNews => {
    const state = useSelector<RootState, UpdateNewsState>(({ updateNewsState }) => updateNewsState);

    const updateNews = useCallback(() => {
        actionDispatch(getUpdateNewsType());
    }, []);

    useEffect(() => {
        if (state.action === UPDATE_NEWS_REQUEST && handlers?.onRequest && typeof handlers.onRequest === 'function') {
            handlers.onRequest(state);
        }

        if (state.action === UPDATE_NEWS_SUCCESS && handlers?.onDone && typeof handlers.onDone === 'function') {
            handlers.onDone(state);
        }

        if (state.action === UPDATE_NEWS_FAILURE && handlers?.onError && typeof handlers.onError === 'function') {
            handlers.onError(state);
        }
    }, [state, handlers]);

    return {
        updateNews,
        updateNewsState: state,
    }
}