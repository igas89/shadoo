import React, { FC, Fragment, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import useTitle from 'hooks/useTitle';
import { useTags } from 'actions/tagsActions/hooks';
import { TagsData } from 'reducers/tagsReducer';
import './Breadcrumbs.scss';

interface BreadcrumbsState {
    items: {
        title: string;
        url?: string;
    }[],
    tags: TagsData['data'],
    isTagsLoaded: boolean;
}

/* TODO: список приоритетных тэгов */
const TAGS_LIST: Record<string, string> = {
    '/tags/419/games': 'Игры',
    '/tags/105/movies': 'Кино',
    '/tags/3162/tv-series': 'Сериалы',
    '/tags/590/anime': 'Аниме',
    '/tags/157/guide': 'Гайды',
    '/tags/2656/vr': 'VR',
    '/tags/3738/arts': 'Дизайн и Арт',
    '/tags/6/gadgets': 'Гаджеты',
    '/tags/3507/hardware': 'Железо',
    '/tags/710/science': 'Наука',
    '/tags/1622/technology': 'IT и Технологии',
    '/tags/8/other': 'Другое',
    '/tags/3/pc': 'PC',
    '/tags/396/ps4': 'PS4',
    '/tags/3302/ps5': 'PS5',
    '/tags/2975/xbox-one': 'Xbox One',
    '/tags/13413/xbox-series-x': 'Xbox Series X',
    '/tags/7576/nintendo-switch': 'Nintendo Switch',
    '/tags/796/iOS': 'iOS',
    '/tags/860/android': 'Android',
    '/platforms/calendar': 'График релизов',
    '/tags/217/review': 'Обзоры',
    '/tags/3261/opinion': 'Мнения',
    '/tags/2473/feature': 'Фичеры',
    '/tags/2534/community-call': 'Community Call',
    '/hubs': 'Хабы',
    '/blogs': 'Блоги',
    '/discounts': 'Скидки',
};

const Breadcrumbs: FC = () => {
    const location = useLocation();

    const { getTitle, breadcrumbsState } = useTitle();
    const [state, setState] = useState<BreadcrumbsState>({
        items: [],
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

    useEffect(() => {
        setState(prevState => ({
            ...prevState,
            isTagsLoaded: true,
        }));

        fetchTags();
    }, [fetchTags]);

    useEffect(() => {
        const { pathname } = location;

        const getPath = (path: string): string | undefined => {
            const matchPathname = pathname.match(new RegExp(path));
            return matchPathname && matchPathname.length && matchPathname[0] || undefined;
        };

        let items: BreadcrumbsState['items'] = [];

        if (pathname === '/') {
            items.push({ title: 'Все новости' });
        } else if (getPath('comments')) {
            items.push({
                title: 'Комментарии',
                url: pathname,
            });
        } else if (getPath('post')) {
            const tags = breadcrumbsState.get(pathname)?.tags || [];
            const tagItems = tags.reduce<BreadcrumbsState['items']>((acc, item) => {
                Object.keys(TAGS_LIST).forEach(key => {
                    const m = key.match(new RegExp(item.url));

                    if (m && m[0]) {
                        acc.push({
                            title: TAGS_LIST[item.url],
                            url: item.url,
                        });
                    }
                });

                return acc;
            }, []);

            items = items.concat([
                ...tagItems.slice(0, 1),
                {
                    title: _.truncate(getTitle(), {
                        length: 110,
                    }),
                    url: pathname,
                },
            ]);
        } else if (getPath('tags')) {
            const tagId = Number(pathname.replace(/(.+)\/(\d+)\/(.+)/, '$2'));
            const title = TAGS_LIST[pathname] || state.tags.find(item => item.id === tagId)?.title;

            items = items.concat([
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
            items,
        }));
    }, [getTitle, location, breadcrumbsState, state.tags]);

    return (
        <div className='breadcrumbs'>
            <div className='breadcrumbs__wrap'>
                <Link className='breadcrumbs__item breadcrumbs__item_first' to='/'>
                    Главная
                </Link>
                {state.items.map(({ title, url }, id) => (
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