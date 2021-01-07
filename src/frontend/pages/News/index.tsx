import React, { memo, useCallback, useEffect, useState } from 'react';

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

const News = memo(() => {
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
        (isLazy = false) => {
            fetchNews({
                page: newsState.page,
            });

            setState((prevState) => ({
                ...prevState,
                page: prevState.page + 1,
                isLoading: true,
                isLazyLoading: isLazy,
            }));
        },
        [fetchNews, newsState.page],
    );

    const lazyLoadPosts = useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
            getPosts(true);
        },
        [getPosts],
    );

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
        } else {
            getPosts();
        }
    }, [getPosts, newsState.isLoading, newsResponseData, newsRequestData]);

    useEffect(() => {
        setTitle('Все новости - Shadoo');
    }, [setTitle]);

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
