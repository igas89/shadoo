import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { actionDispatch, RootState, UseActionHandlers } from 'store';

import {
    POST_REQUEST,
    POST_SUCCESS,
    POST_FAILURE,
    getPostType,
    PostRequestProps,
} from './index';

import { PostState } from 'reducers/postReducer';

export interface UsePost {
    fecthPost: (props: PostRequestProps) => void;
    postState: PostState;
}

export const usePost = <T extends UseActionHandlers<PostState>>(handlers?: T): UsePost => {
    const state = useSelector<RootState, PostState>(({ postState }) => postState);

    const fecthPost = useCallback((props: PostRequestProps) => {
        actionDispatch(getPostType(props));
    }, []);

    useEffect(() => {
        if (state.action === POST_REQUEST && handlers?.onRequest && typeof handlers.onRequest === 'function') {
            handlers.onRequest(state);
        }

        if (state.action === POST_SUCCESS && handlers?.onDone && typeof handlers.onDone === 'function') {
            handlers.onDone(state);
        }

        if (state.action === POST_FAILURE && handlers?.onError && typeof handlers.onError === 'function') {
            handlers.onError(state);
        }
    }, [state, handlers]);

    return {
        fecthPost,
        postState: state,
    }
}