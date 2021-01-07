import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { humanizeDate } from 'utils/Dates';
import { NewsData } from 'reducers/newsReducer';

export interface NewsListsProps {
    data: NewsData['data'];
}

const NewsLists: FC<NewsListsProps> = ({ data }) => (<>
    {data.map((item) => {
        const url = `/post/${item.id}/${item.url}`;

        return (
            <div key={item.id} className='news__item'>
                <div className='news__by'>
                    <span className='news-author'>
                        <img className='news-author__image' src={item.avatar} alt={item.author} />
                        {item.author}
                    </span>
                    <span className='news__date'>{humanizeDate(item.date)}</span>
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
                        <img className='news-image__item' src={item.descriptionImage} alt={item.title} />
                    </Link>
                </div>
            </div>
        );
    })}
</>);

export default NewsLists;