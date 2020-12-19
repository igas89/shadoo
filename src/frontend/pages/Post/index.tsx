import React, { FC, memo, useEffect, useState } from 'react';
import { useLocation } from 'react-router';

import useTitle from 'hooks/useTitle';
import { humanizeDateISO } from 'helpers/Dates';
import { usePost } from 'actions/postActions/hooks';
import { PostData } from 'reducers/postReducer';

import PostTags, { PostTagsProps } from './components/PostTags';
import PostComments, { PostCommentsProps } from './components/PostComments';
import PostEmpty from './components/PostEmpty';

import './Post.scss';

interface State {
    isLoading: boolean | null;
    data: PostData['data'] | null;
}

const Post: FC = memo(() => {
    const { setTitle } = useTitle();
    const { pathname } = useLocation();
    const [postState, setPostState] = useState<State>({
        isLoading: null,
        data: null,
    });

    const [postTags, setPostTags] = useState<PostTagsProps>({
        data: null,
    });

    const [postComments, setPostComments] = useState<PostCommentsProps>({
        count: null,
        data: null,
    });

    const { fetchPost } = usePost({
        onDone(state) {
            if (!postState.isLoading) {
                return;
            }

            const data = state.response_data.data?.length ? state.response_data.data : null;

            if (data) {
                setTitle(data[0].title);
                setPostTags({ data: data[0].tags });
                setPostComments({
                    count: data[0].commentsCount,
                    data: data[0].comments,
                });
            }

            setPostState({
                isLoading: false,
                data,
            });
        },
    });

    useEffect(() => {
        const id = pathname.replace(/^\/post\/(\d+).*/, '$1');

        fetchPost({ id });
        setPostState((prevState) => ({
            ...prevState,
            isLoading: true,
        }));
    }, [pathname]);

    if (!postState.data) {
        return <PostEmpty />;
    }

    return (
        <>
            <div className='post'>
                {postState.data.map((post) => {
                    return (
                        <div key={post.id} className='post__item'>
                            <h1 className='post__title'>{post.title}</h1>
                            <div className='post-by'>
                                <img className='post-by__avatar' src={post.avatar} />
                                <div className='post-by__info'>
                                    <div className='post-by__author'>{post.author}</div>
                                    <div className='post-by__date'>{humanizeDateISO(post.date)}</div>
                                </div>
                            </div>

                            <img className='post-image' src={post.image} />
                            <div className='post__content' dangerouslySetInnerHTML={{ __html: post.content }} />
                        </div>
                    );
                })}
            </div>
            <PostTags data={postTags.data} />
            <PostComments count={postComments.count} data={postComments.data} />
        </>
    );
});

export default Post;
