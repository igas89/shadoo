import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { UpdateNewsState } from 'reducers/updateNewsReducer';
import { actionDispatch, RootState, UseActionHandlers } from 'store';
import useFabricHandlers from 'hooks/useFabricHandlers';

import { UPDATE_NEWS_REQUEST, UPDATE_NEWS_SUCCESS, UPDATE_NEWS_FAILURE, getUpdateNewsType } from './index';

const ACTIONS = [UPDATE_NEWS_REQUEST, UPDATE_NEWS_SUCCESS, UPDATE_NEWS_FAILURE];

export interface UseUpdateNews {
    updateNews: () => void;
    updateNewsState: UpdateNewsState;
}

export const useUpdateNews = <T extends UseActionHandlers<UpdateNewsState>>(handlers?: T): UseUpdateNews => {
    const state = useSelector<RootState, UpdateNewsState>(({ updateNewsState }) => updateNewsState);
    const updateNews = useCallback(() => {
        actionDispatch(getUpdateNewsType());
    }, []);

    useFabricHandlers<UpdateNewsState>(ACTIONS, state, handlers);

    return {
        updateNews,
        updateNewsState: state,
    };
};
