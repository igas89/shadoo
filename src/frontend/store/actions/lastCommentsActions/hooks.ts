import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { LastCommentsState } from 'reducers/lastCommentsReducer';
import { actionDispatch, RootState, UseActionHandlers } from 'store';
import useFabricHandlers from 'hooks/useFabricHandlers';

import {
    LAST_COMMENTS_REQUEST,
    LAST_COMMENTS_SUCCESS,
    LAST_COMMENTS_FAILURE,
    getLastCommentsType,
    LastCommentsRequestProps,
} from './index';

const ACTIONS = [LAST_COMMENTS_REQUEST, LAST_COMMENTS_SUCCESS, LAST_COMMENTS_FAILURE];

export interface UseLastComments {
    fetchLastComments: (props: LastCommentsRequestProps) => void;
    lastCommentsState: LastCommentsState;
}

export const useLastComments = <T extends UseActionHandlers<LastCommentsState>>(handlers?: T): UseLastComments => {
    const state = useSelector<RootState, LastCommentsState>(({ lastCommentsState }) => lastCommentsState);

    const fetchLastComments = useCallback((props: LastCommentsRequestProps) => {
        actionDispatch(getLastCommentsType(props));
    }, []);

    useFabricHandlers<LastCommentsState>(ACTIONS, state, handlers);

    return {
        fetchLastComments,
        lastCommentsState: state,
    };
};
