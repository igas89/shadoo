import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { AuthState } from 'reducers/authReducer';
import { actionDispatch, RootState, UseActionHandlers } from 'store';
import useFabricHandlers from 'hooks/useFabricHandlers';

import { AUTH_REQUEST, AUTH_SUCCESS, AUTH_FAILURE, getAuthType } from './index';

const ACTIONS = [AUTH_REQUEST, AUTH_SUCCESS, AUTH_FAILURE];

export interface UseAuth {
    fetchAuthToken: () => void;
    getToken: () => string;
    authState: AuthState;
}

export const useAuth = <T extends UseActionHandlers<AuthState>>(handlers?: T): UseAuth => {
    const state = useSelector<RootState, AuthState>(({ authState }) => authState);
    const fetchAuthToken = useCallback(() => {
        actionDispatch(getAuthType());
    }, []);

    const getToken = useCallback(() => state.response_data.data?.token as string, [state.response_data]);

    useFabricHandlers<AuthState>(ACTIONS, state, handlers);

    return {
        fetchAuthToken,
        getToken,
        authState: state,
    };
};
