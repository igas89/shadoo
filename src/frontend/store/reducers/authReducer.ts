import { AUTH_REQUEST, AUTH_SUCCESS, AUTH_FAILURE } from 'actions/authActions';
import { ActionTypes, InitialState } from './types';

export interface AuthData {
    data: {
        token: string;
    };
}

export type AuthState = InitialState<null, Partial<AuthData>>;

const AUTH_INITIAL_STATE: AuthState = {
    action: null,
    error: {
        code: null,
        message: null,
    },
    request_data: null,
    response_data: {},
};

export const authReducer = (state = AUTH_INITIAL_STATE, action: ActionTypes<null, AuthData>): AuthState => {
    switch (action.type) {
        case AUTH_REQUEST: {
            return {
                ...state,
                action: action.type,
                error: AUTH_INITIAL_STATE.error,
                request_data: action.payload || null,
            };
        }
        case AUTH_SUCCESS: {
            return {
                ...state,
                action: action.type,
                error: AUTH_INITIAL_STATE.error,
                request_data: null,
                response_data: action.response || {},
            };
        }
        case AUTH_FAILURE: {
            return {
                ...state,
                action: action.type,
                error: action.error || AUTH_INITIAL_STATE.error,
                request_data: null,
                response_data: {},
            };
        }
        default:
            return state;
    }
};
