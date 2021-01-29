import { Map } from 'immutable';
import {
    SET_BREADCRUMBS,
    CLEAR_BREADCRUMBS,
    BreadcrumbsActionProps,
} from 'actions/breadcrumbsActions';

export interface BreadcrumbsAction {
    type: string;
    payload: BreadcrumbsActionProps;
}

export interface BreadcrumbsState {
    title: string;
    tags?: BreadcrumbsActionProps['tags'];
}
export type BreadcrumbsMapState = Map<string, BreadcrumbsState>;

export const breadcrumbsReducer = (
    state = Map<string, BreadcrumbsState>(),
    action: BreadcrumbsAction,
): BreadcrumbsMapState => {
    switch (action.type) {
        case SET_BREADCRUMBS: {
            return state.set(action.payload.url as string, {
                title: action.payload.title,
                tags: action.payload.tags,
            });
        }
        case CLEAR_BREADCRUMBS: {
            state.clear();
            return state;
        }
        default:
            return state;
    }
};