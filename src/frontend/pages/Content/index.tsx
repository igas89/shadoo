import React, { memo } from 'react';

import Comments from 'pages/Comments';
import News from 'pages/News';
import NotFound from 'pages/NotFound';
import Post from 'pages/Post';

import WithRoute from 'components/WithRoute';
import ScrollTopButton from 'components/ScrollTopButton';
import LastCommentsWidget from 'components/LastCommentsWidget';
import './Content.scss';

// const NotFound: FC = () => <div>По вашему запросу, ничего не найдено</div>;

const Content = memo(() => (
    <div className='content'>
        <div className='content__item'>
            <WithRoute
                routes={[
                    {
                        path: ['/', '/tags/:id/:description'],
                        exact: true,
                        children: <News />,
                    },
                    {
                        path: '/comments',
                        exact: true,
                        children: <Comments />,
                    },
                    {
                        path: '/post',
                        children: <Post />,
                    },
                    {
                        path: '*',
                        children: <NotFound />,
                    },
                ]}
            />
        </div>
        <WithRoute
            routes={[
                {
                    path: ['/', '/tags/:id/:description'],
                    exact: true,
                    children: (
                        <div className='content__aside'>
                            <LastCommentsWidget />
                        </div>
                    ),
                },
            ]}
        />
        <ScrollTopButton />
    </div>
));

export default Content;
