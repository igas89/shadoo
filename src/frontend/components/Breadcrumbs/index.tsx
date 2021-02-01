import React, { FC, Fragment, useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import useTitle from 'hooks/useTitle';
import { useTags } from 'actions/tagsActions/hooks';
import { TagsData } from 'reducers/tagsReducer';
import { TAGS_LIST } from 'config/breadcrumbs';
import './Breadcrumbs.scss';

interface BreadcrumbsState {
    breadcrumbsItems: {
        title: string;
        url?: string;
    }[],
    tags: TagsData['data'],
    isTagsLoaded: boolean;
}

const Breadcrumbs: FC = () => {
    const { pathname } = useLocation();
    const { getTitle, breadcrumbsState } = useTitle();
    const [state, setState] = useState<BreadcrumbsState>({
        breadcrumbsItems: [],
        tags: [],
        isTagsLoaded: false,
    });

    const { fetchTags } = useTags({
        onDone(tagsState) {
            if (!state.isTagsLoaded) {
                return;
            }

            setState(prevState => ({
                ...prevState,
                isTagsLoaded: false,
                tags: tagsState.response_data.data as TagsData['data'],
            }));
        },
    });

    const isUrl = useCallback((path: string): string | undefined => {
        const matchPathname = pathname.match(new RegExp(path));
        return matchPathname && matchPathname.length && matchPathname[0] || undefined;
    }, [pathname]);

    useEffect(() => {
        setState(prevState => ({
            ...prevState,
            isTagsLoaded: true,
        }));

        fetchTags();
    }, [fetchTags]);

    useEffect(() => {
        let breadcrumbsItems: BreadcrumbsState['breadcrumbsItems'] = [];

        if (pathname === '/') {
            breadcrumbsItems.push({ title: 'Все новости' });
        } else if (isUrl('comments')) {
            breadcrumbsItems.push({
                title: 'Комментарии',
                url: pathname,
            });
        } else if (isUrl('post')) {
            const tags = breadcrumbsState.get(pathname)?.tags || [];
            const tagItems = Object.keys(TAGS_LIST).reduce<BreadcrumbsState['breadcrumbsItems']>((acc, url) => {
                const filter = tags.filter(item => item.url === url);
                return acc.concat(filter);
            }, []).slice(0, 2);

            breadcrumbsItems = breadcrumbsItems.concat([
                ...tagItems,
                {
                    title: _.truncate(getTitle(), {
                        length: 110,
                    }),
                    url: pathname,
                },
            ]);
        } else if (isUrl('tags')) {
            const tagId = Number(pathname.replace(/(.+)\/(\d+)\/(.+)/, '$2'));
            const title = TAGS_LIST[pathname] || state.tags.find(item => item.id === tagId)?.title;

            breadcrumbsItems = breadcrumbsItems.concat([
                {
                    title: 'Категория',
                },
                {
                    title: title as string,
                    url: pathname,
                },
            ]);
        }

        setState(prevState => ({
            ...prevState,
            breadcrumbsItems,
        }));
    }, [getTitle, pathname, breadcrumbsState, state.tags, isUrl]);

    return (
        <div className='breadcrumbs'>
            <div className='breadcrumbs__wrap'>
                <Link className='breadcrumbs__item breadcrumbs__item_first' to='/'>
                    Главная
                </Link>
                {state.breadcrumbsItems.map(({ title, url }, id) => (
                    <Fragment key={id}>
                        /{url
                            ? <Link className='breadcrumbs__item' to={url}>{title}</Link>
                            : <div className='breadcrumbs__item breadcrumbs__item_notLink'>{title}</div>
                        }
                    </Fragment>
                ))}
            </div>
        </div>
    );
};

export default Breadcrumbs;