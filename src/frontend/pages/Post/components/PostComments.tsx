import React, { FC, useEffect } from 'react';
import { useLocation } from 'react-router';
import { animateScroll as scroll } from 'react-scroll';

import { pluralize } from 'utils/String';
import { StorageResponseComments } from 'types/storage';
import PostCommentsItem from './PostCommentsItem';

export interface PostCommentsProps {
    count: number | null;
    data: StorageResponseComments[] | null;
}

const PostComments: FC<PostCommentsProps> = ({ count, data }) => {
    const { hash } = useLocation();

    useEffect(() => {
        if (!hash) {
            return;
        }

        const offsetTop = document.getElementById(hash.substr(1))?.offsetTop as number;
        scroll.scrollTo(offsetTop);
    }, [hash]);

    return (
        <div className='post-comments'>
            <div className='post-comments__count'>{count} {pluralize(count as number, 'Комментари', ['й', 'я', 'ев'])}</div>
            {data && (
                <div className='post-comments__list'>
                    {data.map((comment) => {
                        const active = (hash && Number(hash.substr(1)) === comment.id) as boolean;
                        return (
                            <PostCommentsItem key={comment.id as string} data={comment} active={active}>
                                {comment.children &&
                                    comment.children.length > 0 &&
                                    comment.children.map((childrenComment) => {
                                        // eslint-disable-next-line max-len
                                        const active = (hash && Number(hash.substr(1)) === childrenComment.id) as boolean;
    
                                        return (
                                            <PostCommentsItem
                                                key={childrenComment.id}
                                                data={childrenComment}
                                                active={active}
                                            />
                                        );
                                    })}
                            </PostCommentsItem>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default PostComments;
