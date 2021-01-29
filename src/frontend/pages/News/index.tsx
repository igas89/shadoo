import React, { memo, useCallback, useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router';

import { useNews } from 'actions/newsActions/hooks';
import useTitle from 'hooks/useTitle';

import NewsLists, { NewsListsProps } from './components/NewsLists';
import NewsEmpty from './components/NewsEmpty';
import './News.scss';

interface NewsState {
    page: number;
    counts: number;
    isLoading: boolean | null;
    isError: boolean | null;
    erroMessage: string | null;
    isLazyLoading: boolean;
    lists: NewsListsProps['data'] | null;
}

interface GetPosts {
    isLazy: boolean;
    pathname?: string;
}

const News = memo(() => {
    const location = useLocation();
    const prevPathName = useRef(location.pathname);
    const { setTitle } = useTitle();
    const [newsState, setState] = useState<NewsState>({
        page: 1,
        counts: 0,
        isLoading: null,
        erroMessage: null,
        isError: null,
        isLazyLoading: false,
        lists: null,
    });

    const {
        fetchNews, newsState: {
            request_data: newsRequestData,
            response_data: newsResponseData,
        },
    } = useNews({
        onRequest(state) {
            if (newsState.isLoading === null || !newsState.isLoading) {
                setState((prevState) => ({
                    ...prevState,
                    isLoading: true,
                }));
            }
        },
        onDone(state) {
            if (newsState.isLoading) {
                setState((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    counts: state.response_data.counts || 0,
                    lists: state.response_data.data || [],
                }));
            }
        },
        onError(state) {
            if (newsState.isLoading) {
                setState((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    isError: true,
                    erroMessage: state.error.message,
                }));
            }
        },
    });

    const getPosts = useCallback(
        ({ pathname, isLazy }: GetPosts) => {
            const tag = pathname?.replace(/.+\/(\d+)\/.+/, '$1');
            const isChangeLocation = prevPathName.current !== location.pathname;
            prevPathName.current = location.pathname;

            fetchNews({
                page: isChangeLocation ? 1 : newsState.page,
                ...(tag !== '/' ? { tag } : {}),
            });

            setState((prevState) => ({
                ...prevState,
                page: isChangeLocation ? 2 : prevState.page + 1,
                isLoading: true,
                isLazyLoading: isLazy,
            }));
        },
        [fetchNews, newsState.page, location],
    );

    const lazyLoadPosts = useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
            getPosts({
                isLazy: true,
                pathname: location.pathname,
            });
        },
        [getPosts, location.pathname],
    );

    useEffect(() => {
        if (newsState.isLoading !== null && location.pathname === prevPathName.current) {
            return;
        }

        getPosts({
            pathname: location.pathname,
            isLazy: false,
        });
    }, [getPosts, prevPathName, location, newsState.isLoading]);

    useEffect(() => {
        if (newsState.isLoading !== null) {
            return;
        }

        if (newsResponseData?.data && newsResponseData.data.length) {
            const page = newsRequestData?.page || 1;
            setState((prevState) => ({
                ...prevState,
                isLoading: false,
                counts: newsResponseData.counts || 0,
                lists: newsResponseData.data || [],
                page: page + 1,
            }));
        }
    }, [newsState.isLoading, newsResponseData, newsRequestData]);

    useEffect(() => {
        if (location.pathname !== '/') {
            return;
        }

        setTitle({ title: 'Все новости - Shadoo' });
    }, [setTitle, location.pathname]);

    if (!newsState.lists) {
        return null;
    }

    return (
        <div className='news'>
            {newsState.lists.length > 0
                ? <NewsLists data={newsState.lists} />
                : <NewsEmpty />
            }

            {newsState.counts > 0 && newsState.lists.length < newsState.counts && (
                <div className='news-loaded'>
                    <button type='button' className='news-loaded__btn' onClick={lazyLoadPosts}>
                        Показать еще
                    </button>
                </div>
            )}
        </div>
    );
});

export default News;
