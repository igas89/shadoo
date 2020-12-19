import React, { FC } from 'react';

import { humanizeDateISO } from 'helpers/Dates';
import { StorageResponseComments } from 'types/storage';

interface Data extends Omit<StorageResponseComments, 'children'> {
    recipient?: string;
}

export interface PostCommentsItemProps {
    key: number;
    data: Data;
    children?: React.ReactNode;
}

const PostCommentsItem: FC<PostCommentsItemProps> = ({ data, children }) => {
    return (
        <>
            <div className='post-comments__item'>
                <div className='post-comments__info'>
                    <img className='post-comments__avatar' src={data.avatar || '/img/avatar.jpg'} />
                    <div className='post-comments__by'>
                        <span className='post-comments__author'>{data.author}</span>
                        <span className='post-comments__date'>{humanizeDateISO(data.date)}</span>
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
};

export default PostCommentsItem;
