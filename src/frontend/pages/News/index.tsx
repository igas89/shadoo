import React, { memo, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { humanizeDateISO } from 'helpers/Dates';
import { NewsData } from 'reducers/newsReducer';
import { useNews } from 'actions/newsActions/hooks';
import useTitle from 'hooks/useTitle';
import './News.scss';

interface NewsState {
    start: number;
    end: number;
    counts: number;
    isLoading: boolean | null;
    isLazyLoading: boolean;
    lists: NewsData['data'],
}

const News = memo(() => {
    const { setTitle } = useTitle();
    const [newsState, setState] = useState<NewsState>({
        start: 1,
        end: 20,
        counts: 0,
        isLoading: null,
        isLazyLoading: false,
        lists: [],
    });

    const { fecthNews } = useNews({
        onRequest(state) {
            if (newsState.isLoading === null || !newsState.isLoading) {
                setState(prevState => ({
                    ...prevState,
                    isLoading: true,
                }));
            }
        },
        onDone(state) {
            if (newsState.isLoading) {
                setState(prevState => ({
                    ...prevState,
                    isLoading: false,
                    counts: state.response_data.counts || 0,
                    lists: newsState.isLazyLoading
                        ? prevState.lists.concat(state.response_data.data || [])
                        : state.response_data.data || [],
                }));
            }
        }
    });

    const getPosts = useCallback((isLazy: boolean = false) => {
        fecthNews({
            start: newsState.start,
            end: newsState.end,
        });

        setState(prevState => ({
            ...prevState,
            start: prevState.end + 1,
            end: prevState.end + 20,
            isLoading: true,
            isLazyLoading: isLazy,
        }));
    }, [newsState.start, newsState.end]);

    const lazyLoadPosts = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        getPosts(true);
    }, [getPosts]);

    useEffect(() => {
        if (newsState.isLoading === null) {
            getPosts();
        }
    }, [newsState.isLoading]);

    useEffect(() => {
        setTitle('Все новости - Shadoo');
    }, []);

    return (
        <div className='news'>
            {newsState.lists.map((item) => {
                const url = `/post/${item.id}/${item.url}`;

                return (
                    <div key={item.id} className='news__item'>
                        <div className='news__by'>
                            <span className='news-author'>
                                <img className='news-author__image' src={item.avatar} />
                                {item.author}
                            </span>
                            <span className='news__date'>{humanizeDateISO(item.date)}</span>
                            <span className='news__chat'>
                                {item.commentsCount}
                                {item.commentsCount > 0 ? <span className='news__chat_red'>++</span> : null}
                            </span>
                        </div>
                        <h2 className='news__title'>
                            <Link to={url}>{item.title}</Link>
                        </h2>
                        <div className='news__description'>{item.description}</div>

                        <div className='news-image'>
                            <Link to={url}>
                                <img className='news-image__item' src={item.descriptionImage} />
                            </Link>
                        </div>
                    </div>
                )
            })}

            {newsState.counts > 0 && newsState.lists.length < newsState.counts && (
                <div className='news-loaded'>
                    <button className='news-loaded__btn' onClick={lazyLoadPosts}>Показать еще</button>
                </div>
            )}
        </div>
    )
});

export default News;