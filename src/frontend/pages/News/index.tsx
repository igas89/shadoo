import React, { memo, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { humanizeDateISO } from 'helpers/Dates';
import { NewsData } from 'reducers/newsReducer';
import { useNews } from 'actions/newsActions/hooks';
import './News.scss';

interface NewsState {
    start: number;
    end: number;
    counts: number;
    isLoading: boolean | null;
    lists: NewsData['data'],
}

const News = memo(() => {
    const [newsState, setState] = useState<NewsState>({
        start: 1,
        end: 20,
        counts: 0,
        isLoading: null,
        lists: [],
    });

    const { fecthNews } = useNews({
        onRequest(state) {
            if (newsState.isLoading === null) {
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
                    lists: prevState.lists.concat(state.response_data.data || []),
                }));
            }
        }
    });

    const getPosts = useCallback(() => {
        fecthNews({
            start: newsState.start,
            end: newsState.end,
        });

        setState(prevState => ({
            ...prevState,
            start: prevState.end + 1,
            end: prevState.end + 20,
            isLoading: true,
        }));
    }, [newsState.start, newsState.end]);

    useEffect(() => {
        if (newsState.isLoading === null) {
            getPosts();
        }
    }, [newsState.isLoading]);

    return (
        <div className='news'>
            {newsState.lists.map((item) => {
                const url = `/post/${item.url}`;

                return (
                    <div key={item.id} className='news__item'>
                        <div className='news__by'>
                            <span className='news-author'>
                                <img className='news-author__image' src={item.avatar} />
                                {item.author}
                            </span>
                            <span className='news__date'>{humanizeDateISO(item.date)}</span>
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
                    <button className='news-loaded__btn' onClick={getPosts}>Показать еще</button>
                </div>
            )}
        </div>
    )
});

export default News;