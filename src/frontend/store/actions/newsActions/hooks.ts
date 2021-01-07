import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import useFabricHandlers from 'hooks/useFabricHandlers';
import { actionDispatch, RootState, UseActionHandlers } from 'store';
import { NewsState } from 'reducers/newsReducer';

import {
    NEWS_REQUEST,
    NEWS_SUCCESS,
    NEWS_FAILURE,
    getNewsType,
    NewsRequestProps,
} from './index';

export interface UseNews {
    fetchNews: (props: NewsRequestProps) => void;
    newsState: NewsState;
}

const ACTIONS = [NEWS_REQUEST, NEWS_SUCCESS, NEWS_FAILURE];

export const useNews = <T extends UseActionHandlers<NewsState>>(handlers?: T): UseNews => {
    const state = useSelector<RootState, NewsState>(({ newsState }) => newsState);
    const fetchNews = useCallback((props: NewsRequestProps) => {
        actionDispatch(getNewsType(props));
    }, []);

    useFabricHandlers<NewsState>(ACTIONS, state, handlers);

    return {
        fetchNews,
        newsState: state,
    };
};
