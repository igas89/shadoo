import React, { FC } from 'react';

import { humanizeDate } from 'utils/Dates';
import { StorageResponseComments } from 'types/storage';

interface Data extends Omit<StorageResponseComments, 'children'> {
    recipient?: string;
}

export interface PostCommentsItemProps {
    key: string | number;
    active: boolean;
    data: Data;
    children?: React.ReactNode;
}

const PostCommentsItem: FC<PostCommentsItemProps> = ({ active, data, children }) => (
    <>
        <div className={`post-comments__item ${active ? 'post-comments__item_active' : ''}`} id={data.id as string}>
            <div className='post-comments__info'>
                <img className='post-comments__avatar' src={data.avatar || '/img/avatar.jpg'} alt={data.author} />
                <div className='post-comments__by'>
                    <span className='post-comments__author'>{data.author}</span>
                    <span className='post-comments__date'>{humanizeDate(data.date)}</span>
                </div>
            </div>
            <div className='post-comments__content'>
                {data.recipient ? <span className='post-comments__author'>{data.recipient}, </span> : null}
                <span className='post-comments__text'>{data.content}</span>
            </div>
        </div>
        {children && <div className='post-comments__children'>{children}</div>}
    </>
);

export default PostCommentsItem;
