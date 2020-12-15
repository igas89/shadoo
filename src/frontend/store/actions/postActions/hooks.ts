import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { PostState } from 'reducers/postReducer';
import { actionDispatch, RootState, UseActionHandlers } from 'store';
import useFabricHandlers from 'hooks/useFabricHandlers';

import {
    POST_REQUEST,
    POST_SUCCESS,
    POST_FAILURE,
    getPostType,
    PostRequestProps,
} from './index';

const ACTIONS = [POST_REQUEST, POST_SUCCESS, POST_FAILURE];

export interface UsePost {
    fetchPost: (props: PostRequestProps) => void;
    postState: PostState;
}

export const usePost = <T extends UseActionHandlers<PostState>>(handlers?: T): UsePost => {
    const state = useSelector<RootState, PostState>(({ postState }) => postState);

    const fetchPost = useCallback((props: PostRequestProps) => {
        actionDispatch(getPostType(props));
    }, []);

    useFabricHandlers<PostState>(ACTIONS, state, handlers);
   
    return {
        fetchPost,
        postState: state,
    }
}