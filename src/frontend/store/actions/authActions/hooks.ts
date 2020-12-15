import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { AuthState } from 'reducers/authReducer';
import { actionDispatch, RootState, UseActionHandlers } from 'store';
import useFabricHandlers from 'hooks/useFabricHandlers';

import {
    AUTH_REQUEST,
    AUTH_SUCCESS,
    AUTH_FAILURE,
    getAuthType,
} from './index';

const ACTIONS = [AUTH_REQUEST, AUTH_SUCCESS, AUTH_FAILURE];

export interface UseAuth {
    fetchAuthToken: () => void;
    authState: AuthState;
}

export const useAuth = <T extends UseActionHandlers<AuthState>>(handlers?: T): UseAuth => {
    const state = useSelector<RootState, AuthState>(({ authState }) => authState);
    const fetchAuthToken = useCallback(() => {
        actionDispatch(getAuthType());
    }, []);

    useFabricHandlers<AuthState>(ACTIONS, state, handlers);

    return {
        fetchAuthToken,
        authState: state,
    }
}