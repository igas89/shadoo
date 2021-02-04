import React, { FC, memo, useCallback, useContext, useState, useMemo, useEffect } from 'react';

import { LAST_COMMENTS_WIDGET_LIMIT } from 'config';
import useModal from 'hooks/useModal';
import { useNews } from 'actions/newsActions/hooks';
import { useLastComments } from 'actions/lastCommentsActions/hooks';
import { useUpdateNews } from 'actions/updateNewsActions/hooks';
import { WsContext } from 'context/wsContext';
import { UpdateNewsModalProps } from 'modals/components/UpdateNewsModal';

import { UPDATE_NEWS_MODAL } from 'constants/modals';
import { WS_UPDATE_NEWS } from 'ws/constants';

import './ButtonUpdate.scss';

export interface ButtonUpdateProps {
    className?: string;
}

const INIT_TITLE = 'Обновить новости';

const ButtonUpdate: FC<ButtonUpdateProps> = memo(({
    className = '',
}) => {
    const [isUpdate, setUpdate] = useState<boolean | null>(false);
    const [isLoading, setLoading] = useState<boolean | null>(null);
    const [percent, setPercent] = useState<number>(0);
    const [title, setTitle] = useState<string>(INIT_TITLE);

    const { showModal } = useModal();
    const { ws } = useContext(WsContext);
    const { fetchLastComments, lastCommentsState } = useLastComments();
    const { fetchNews, newsState } = useNews({
        onDone() {
            if (!isUpdate || (isUpdate && !isLoading)) {
                return;
            }

            setLoading(false);
            setUpdate(false);
            setPercent(0);
        },
    });

    const { updateNews } = useUpdateNews({
        onRequest() {
            setUpdate(true);
        },
        onDone(state) {
            if (!isUpdate || isLoading) {
                return;
            }

            if (state.response_data.data) {
                showModal<UpdateNewsModalProps>(
                    UPDATE_NEWS_MODAL,
                    { data: state.response_data.data },
                );
            }

            setLoading(true);
            fetchNews({
                page: newsState.request_data?.page || 1,
                tag: newsState.request_data?.tag || undefined,
            });
            fetchLastComments({
                limit: lastCommentsState.request_data?.limit || LAST_COMMENTS_WIDGET_LIMIT,
            });
        },
        onError() {
            if (!isUpdate || isLoading) {
                return;
            }

            setLoading(false);
            setUpdate(false);
            setPercent(0);
        },
    });

    const onUpdateData = useCallback(
        () => {
            if (isLoading || isUpdate) {
                return;
            }

            setUpdate(true);
            setTitle('Обновление новостей');
            updateNews();
        },
        [isLoading, isUpdate, updateNews],
    );

    useEffect(() => {
        ws.on(WS_UPDATE_NEWS, (data: {
            percent?: number;
            status?: string;
            done: boolean;
        }) => { 
            if (data.done) {
                setTitle(INIT_TITLE);
                setUpdate(false);
                return;
            }

            if (data.percent) {
                setPercent(data.percent);
            }

            if (data.status) {
                setTitle(data.status);
            }
        });
    }, [ws]);

    const containerClass = useMemo(() => `update ${className} ${isUpdate ? 'update_active' : ''}`, [className, isUpdate]);

    return (
        <div className={containerClass}>
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
            <img className='update__img' src='/icons/refresh.svg' title={title} alt={title} onClick={onUpdateData} />
            {isUpdate && <div className='update__percent'>{percent}%</div>}
            <button type='button' className="update__btn " onClick={onUpdateData}>
                {title}
            </button>
        </div>
    );
});

export default ButtonUpdate;
