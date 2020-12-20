import React, { FC, memo } from 'react';

import News from 'pages/News';
import Post from 'pages/Post';

import WithRoute from 'components/WithRoute';
import ScrollTopButton from 'components/ScrollTopButton';
import './Content.scss';

const NotFound: FC = () => <div>По вашему запросу, ничего не найдено</div>;

const Content = memo(() => (
    <div className='content'>
        <div className='content__item'>
            <WithRoute
                routes={[
                    {
                        path: '/',
                        exact: true,
                        children: <News />,
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
        <ScrollTopButton />
    </div>
));

export default Content;
