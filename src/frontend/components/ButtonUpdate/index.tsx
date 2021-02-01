import React, { FC, memo, useCallback, useState, useMemo } from 'react';

import { LAST_COMMENTS_WIDGET_LIMIT } from 'config';
import useModal from 'hooks/useModal';
import { useNews } from 'actions/newsActions/hooks';
import { useLastComments } from 'actions/lastCommentsActions/hooks';
import { useUpdateNews } from 'actions/updateNewsActions/hooks';

import { UpdateNewsModalProps } from 'modals/components/UpdateNewsModal';
import './ButtonUpdate.scss';

export interface ButtonUpdateProps {
    className?: string;
}

const ButtonUpdate: FC<ButtonUpdateProps> = memo(({
    className = '',
}) => {
    const [isUpdate, setUpdate] = useState<boolean | null>(null);
    const [isLoading, setLoading] = useState<boolean | null>(null);
    const { showModal } = useModal();
    const { fetchLastComments } = useLastComments();
    const { fetchNews, newsState } = useNews({
        onDone() {
            if (!isUpdate || (isUpdate && !isLoading)) {
                return;
            }

            setLoading(false);
            setUpdate(false);
        },
    });

    const { updateNews } = useUpdateNews({
        onRequest(state) {
            setUpdate(true);
        },
        onDone(state) {
            if (!isUpdate || isLoading) {
                return;
            }

            if (state.response_data.data) {
                showModal<UpdateNewsModalProps>(
                    'UPDATE_NEWS_MODAL',
                    { data: state.response_data.data },
                );
            }

            setLoading(true);
            fetchNews({
                page: newsState.request_data?.page || 1,
                tag: newsState.request_data?.tag || undefined,
            });
            fetchLastComments({
                limit: LAST_COMMENTS_WIDGET_LIMIT,
            });
        },
        onError() {
            if (!isUpdate || isLoading) {
                return;
            }

            setLoading(false);
            setUpdate(false);
        },
    });

    const onUpdateData = useCallback(
        () => {
            if (isLoading || isUpdate) {
                return;
            }

            setUpdate(true);
            updateNews();
        },
        [isLoading, isUpdate, updateNews],
    );

    const containerClass = useMemo(() => `update ${className}`, [className]);
    
    return (
        <div className={containerClass}>
            <button type='button' className={`update__btn ${isUpdate ? 'update__btn_disabled' : ''}`} onClick={onUpdateData}>
                {isUpdate ? 'Обновление новостей' : 'Обновить новости'}
            </button>
        </div>
    );
});

export default ButtonUpdate;
