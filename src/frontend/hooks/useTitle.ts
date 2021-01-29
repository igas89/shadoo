import { useCallback } from 'react';
import { useLocation } from 'react-router';
import { useSelector } from 'react-redux';

import { actionDispatch, RootState } from 'store';
import { setBreadcrumbsType, BreadcrumbsActionProps } from 'actions/breadcrumbsActions';
import { BreadcrumbsMapState } from 'reducers/breadcrumbsReducer';

export interface UseTitle {
    setTitle(props: BreadcrumbsActionProps): void;
    getTitle(): string;
    breadcrumbsState: BreadcrumbsMapState;
}

const useTitle = (): UseTitle => {
    const { pathname } = useLocation();
    const breadcrumbsState = useSelector<RootState, BreadcrumbsMapState>(({ breadcrumbsState }) => breadcrumbsState);

    const setTitle = useCallback(({ title, url, tags }: BreadcrumbsActionProps): void => {
        document.title = title;
        actionDispatch(setBreadcrumbsType({
            title,
            url: url || pathname,
            tags,
        }));
    }, [pathname]);

    // eslint-disable-next-line max-len
    const getTitle = useCallback((): string => breadcrumbsState.get(pathname)?.title as string, [pathname, breadcrumbsState]);

    return {
        setTitle,
        getTitle,
        breadcrumbsState,
    };
};

export default useTitle;
