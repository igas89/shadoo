import React, { FC } from 'react';

import { StorageResponseComments } from 'types/storage';
import PostCommentsItem from './PostCommentsItem';

export interface PostCommentsProps {
    count: number | null;
    data: StorageResponseComments[] | null;
}

const PostComments: FC<PostCommentsProps> = ({ count, data }) => {
    return (
        <div className='post-comments'>
            <div className='post-comments__count'>{count} Комментарий</div>
            {data && (
                <div className='post-comments__list'>
                    {data.map((comment, key) => {
                        return (
                            <PostCommentsItem key={key} data={comment}>
                                {comment.children &&
                                    comment.children.length > 0 &&
                                    comment.children.map((childrenComment, cKey) => {
                                        return <PostCommentsItem key={cKey} data={childrenComment} />;
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
