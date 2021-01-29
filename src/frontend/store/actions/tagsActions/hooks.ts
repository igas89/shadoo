import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { TagsState } from 'reducers/tagsReducer';
import { actionDispatch, RootState, UseActionHandlers } from 'store';
import useFabricHandlers from 'hooks/useFabricHandlers';

import { TAGS_REQUEST, TAGS_SUCCESS, TAGS_FAILURE, getTagsType, TagsRequestProps } from './index';

const ACTIONS = [TAGS_REQUEST, TAGS_SUCCESS, TAGS_FAILURE];

export interface UseTags {
    fetchTags: (props?: TagsRequestProps) => void;
    tagsState: TagsState;
}

export const useTags = <T extends UseActionHandlers<TagsState>>(handlers?: T): UseTags => {
    const state = useSelector<RootState, TagsState>(({ tagsState }) => tagsState);

    const fetchTags = useCallback((props?: TagsRequestProps) => {
        actionDispatch(getTagsType(props));
    }, []);

    useFabricHandlers<TagsState>(ACTIONS, state, handlers);

    return {
        fetchTags,
        tagsState: state,
    };
};
