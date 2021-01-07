import React, { FC } from 'react';
import ButtonUpdate from 'components/ButtonUpdate';

const NewsEmpty: FC = () => (
    <div className='news-empty' >
        <div className='news-empty__title'>Список новостей пуст</div>
        <div className='news-empty__content'>
            Пожалуйста нажмите на кнопку <ButtonUpdate className='news-empty__update' /> для обновления новостей
        </div>
    </div>
);
export default NewsEmpty;