import React, { FC, memo, useCallback, useState } from 'react';
import './ButtonUpdate.scss';

import { useNews } from 'actions/newsActions/hooks';
import { useUpdateNews } from 'actions/updateNewsActions/hooks';

const ButtonUpdate: FC = memo(() => {
    const [isUpdate, setUpdate] = useState<boolean | null>(null);
    const [isLoading, setLoading] = useState<boolean | null>(null);
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
        onDone() {
            if (!isUpdate || isLoading) {
                return;
            }

            setLoading(true);
            fetchNews({
                start: 1,
                end: newsState.request_data?.end || 20,
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

    return (
        <div className='update' >
            <button type='button' className={`update__btn ${isUpdate ? 'update__btn_disabled' : ''}`} onClick={onUpdateData}>
                {isUpdate ? 'Обновление новостей' : 'Обновить новости'}
            </button>
        </div>
    );
});

export default ButtonUpdate;
