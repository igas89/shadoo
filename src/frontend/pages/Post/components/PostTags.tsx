import React, { FC, ReactNode, memo } from 'react';
import { Link } from 'react-router-dom';
import { StorageResponseTags } from 'types/storage';

export interface PostTagsProps {
    data: StorageResponseTags[] | null;
}

const PostTags: FC<PostTagsProps> = memo(({ data }) => (
        <div className='post-tags'>
            <span className='post-tags__title'>Тэги:</span>
            <span className='post-tags__list'>
                {data &&
                    data
                        .map<ReactNode>((item, key) => (
                            <Link key={key} to={`/tags/${item.id}/${item.description}`} className='post-tags__item'>
                                {item.title}
                            </Link>
                        ))
                        .reduce((prev, curr) => [prev, ', ', curr])}
            </span>
        </div>
    ));

export default PostTags;
