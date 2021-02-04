import React, { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useLastComments } from 'actions/lastCommentsActions/hooks';
import { LastCommentsData } from 'reducers/lastCommentsReducer';
import { humanizeDate } from 'utils/Dates';

import './Comments.scss';

interface CommentsState {
    isLoaded: boolean | null;
    counts: number;
    commentItems: LastCommentsData['data']
}

const Comments: FC = () => {
    const [state, setState] = useState<CommentsState>({
        isLoaded: null,
        counts: 0,
        commentItems: [],
    });

    const { fetchLastComments } = useLastComments({
        onRequest() {
            if (state.isLoaded) {
                return;
            }

            setState(prevState => ({
                ...prevState,
                isLoaded: true,
            }));
        },
        onDone(LastComments) {
            if (!state.isLoaded) {
                return;
            }

            setState(prevState => ({
                ...prevState,
                isLoaded: false,
                counts: LastComments.response_data.counts as number,
                commentItems: LastComments.response_data.data as LastCommentsData['data'],
            }));
        },
    });

    useEffect(() => {
        if (state.isLoaded !== null) {
            return;
        }

        fetchLastComments({
            limit: 20,
        });
    }, [fetchLastComments, state.isLoaded]);

    return (
        <div className='comments'>
            <div className='comments__title'>Последниe комментарии</div>
            <div className='comments__list'>
                {state.commentItems.map((comment) => {
                    const url = (
                        <Link className='comments__post' to={`/post/${comment.post_id}/${comment.url}#${comment.id}`}>
                            {comment.title}
                        </Link>
                    );
                    return (
                        <div key={comment.id} className='comments__item'>
                            <div className='comments__header'>
                                <img className='comments__avatar' src={comment.avatar || '/img/avatar.jpg'} alt={comment.author} />
                                <div className='comments__by'>
                                    <div className='comments__author'>
                                        {comment.author} <span>в посте</span> {url}
                                    </div>
                                    <div className='comments__date'>{humanizeDate(comment.date)}</div>
                                </div>
                            </div>
                            <div className='comments__content'>
                                {comment.recipient
                                    ? <span className='comments__recipient'>{comment.recipient}, </span>
                                    : null
                                }
                                {comment.content}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div>
                Counts: {state.counts}
            </div>
        </div>
    );
};

export default Comments;