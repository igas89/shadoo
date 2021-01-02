import React, { FC } from 'react';

import { pluralize } from 'utils/String';
import { StorageResponseComments } from 'types/storage';
import PostCommentsItem from './PostCommentsItem';

export interface PostCommentsProps {
    count: number | null;
    data: StorageResponseComments[] | null;
}

const PostComments: FC<PostCommentsProps> = ({ count, data }) => (
    <div className='post-comments'>
        <div className='post-comments__count'>{count} {pluralize(count as number, 'Комментари', ['й', 'я', 'ев'])}</div>
        {data && (
            <div className='post-comments__list'>
                {data.map((comment) => (
                    <PostCommentsItem key={comment.id as string} data={comment}>
                        {comment.children &&
                            comment.children.length > 0 &&
                            comment.children.map((childrenComment, cKey) => (
                                <PostCommentsItem key={cKey} data={childrenComment} />
                            ))}
                    </PostCommentsItem>
                ))}
            </div>
        )}
    </div>
);

export default PostComments;
