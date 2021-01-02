import React, { FC, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import { LAST_COMMENTS_WIDGET_LIMIT } from 'config';
import { useLastComments } from 'actions/lastCommentsActions/hooks';
import { LastCommentsData } from 'reducers/lastCommentsReducer';
import { humanizeDate } from 'utils/Dates';

import './LastCommentsWidget.scss';

interface LastCommentsState {
    isLoading: boolean | null;
    isError: boolean;
    erroMessage: string | null;
    items: LastCommentsData['data'];
}

const LastCommentsWidget: FC = () => {
    const [lastCommentsState, setLastComments] = useState<LastCommentsState>({
        isLoading: null,
        isError: false,
        erroMessage: null,
        items: [],
    });

    const { fetchLastComments } = useLastComments({
        onRequest(state) {
            if (lastCommentsState.isLoading === null || !lastCommentsState.isLoading) {
                setLastComments((prevState) => ({
                    ...prevState,
                    isLoading: true,
                }));
            }
        },
        onDone(state) {
            if (lastCommentsState.isLoading) {
                setLastComments((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    items: state.response_data.data || [],
                }));
            }

        },
        onError(state) {
            if (lastCommentsState.isLoading) {
                setLastComments((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    isError: true,
                    erroMessage: state.error.message,
                }));
            }
        },
    });

    useEffect(() => {
        if (lastCommentsState.isLoading !== null) {
            return;
        }

        fetchLastComments({
            limit: LAST_COMMENTS_WIDGET_LIMIT,
        });
    }, [fetchLastComments, lastCommentsState.isLoading]);

    const getRecipient = useCallback((recipient?: string): string => recipient ? `${recipient}, ` : '', []);

    return (
        <div className='lastCommentsWidget'>
            <div className='lastCommentsWidget__title'>
                <Link to='/comments'>Последние комментарии</Link>
            </div>
            <div className='lastCommentsWidget__list'>
                {lastCommentsState.items.map((item) => {
                    const url = `/post/${item.post_id}/${item.url}`;
                    const title = _.truncate(item.title, {
                        length: 71,
                        separator: ' ',
                    });
                    const content = _.truncate(`${getRecipient(item.recipient)}${item.content}`, {
                        length: 71,
                        // separator: ' ',
                    });

                    return (
                        <div key={item.id} className='lastCommentsWidget-item'>
                            <div className='lastCommentsWidget-item__header'>
                                <img className='lastCommentsWidget-item__avatar' src={item.avatar || '/img/avatar.jpg'} alt={item.author} />
                                <div className='lastCommentsWidget-item__by'>
                                    <div className='lastCommentsWidget-item__author'>{item.author}</div>
                                    <div className='lastCommentsWidget-item__date'>{humanizeDate(item.date)}</div>
                                </div>
                            </div>
                            <div className='lastCommentsWidget-item__content'>
                                {content}
                            </div>
                            <div className='lastCommentsWidget-item__title' >
                                <Link to={url}>{title}</Link>
                            </div>

                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LastCommentsWidget;