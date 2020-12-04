import React, { memo } from 'react';
import News from 'pages/News';
import WithRoute from 'components/WithRoute';
import './Content.scss';

const NotFound = () => (
    <div>
        По вашему запросу, ничего не найдено
    </div>
);

const Content = memo(() => {
    return (
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
                            path: '*',
                            children: <NotFound />
                        },
                    ]}
                />
            </div>
        </div>
    )
});

export default Content;