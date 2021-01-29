export const SET_BREADCRUMBS = 'SET_BREADCRUMBS';
export const CLEAR_BREADCRUMBS = 'CLEAR_BREADCRUMBS';

export interface BreadcrumbsActionProps {
    title: string;
    url?: string;
    tags?: {
        id: number;
        title: string;
        url: string;
    }[];
}

export type ActionBreadcrumbs = {
    type: string;
    payload?: BreadcrumbsActionProps;
};

export const setBreadcrumbsType = (payload: BreadcrumbsActionProps): ActionBreadcrumbs => ({
    type: SET_BREADCRUMBS,
    payload,
});

export const clearBreadcrumbsType = (): ActionBreadcrumbs => ({
    type: CLEAR_BREADCRUMBS,
});
