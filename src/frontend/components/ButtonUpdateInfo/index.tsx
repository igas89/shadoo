import React, { FC, memo, useCallback, useMemo, useState } from 'react';

import useModal from 'hooks/useModal';
import { useUpdateNews } from 'actions/updateNewsActions/hooks';
import { UpdateNewsModalProps } from 'modals/components/UpdateNewsModal';

import { UPDATE_NEWS_MODAL } from 'constants/modals';

import { UpdateNewsData } from 'reducers/updateNewsReducer';
import './ButtonUpdateInfo.scss';

export interface ButtonUpdateInfoProps {
    className?: string;
}

interface ButtonUpdateInfoState {
    isLoaded: boolean;
    data: Partial<UpdateNewsData['data']> | null;
}

const ButtonUpdateInfo: FC<ButtonUpdateInfoProps> = memo(({
    className = '',
}) => {
    const [state, setState] = useState<ButtonUpdateInfoState>({
        isLoaded: false,
        data: null,
    });
    const { showModal } = useModal();
    useUpdateNews({
        onRequest() {
            if (state.isLoaded) {
                return;
            }

            setState(prevState => ({
                ...prevState,
                isLoaded: true,
                data: null,
            }));
        },
        onDone(updateNewsState) {
            if (!state.isLoaded) {
                return;
            }

            setState(prevState => ({
                ...prevState,
                isLoaded: false,
                data: updateNewsState.response_data.data || null,
            }));
        },
        onError() {
            if (state.isLoaded) {
                return;
            }

            setState(prevState => ({
                ...prevState,
                isLoaded: true,
                data: null,
            }));
        },
    });

    const onClickHandle = useCallback(() => {
        if (state.data) {
            showModal<UpdateNewsModalProps>(
                UPDATE_NEWS_MODAL,
                {
                    title: 'Последнее обновление новостей',
                    data: state.data as UpdateNewsData['data'],
                },
            );
        }
    }, [showModal, state.data]);

    const containerClass = useMemo(() => `update-info ${className} ${state.data ? 'update-info_active' : ''}`.trim(), [className, state.data]);
    const title = 'Предыдущее обновление';

    return (
        <div className={containerClass}>
            <button type='button' className="update-info__btn" onClick={onClickHandle}>
                <img className='update-info__img' src='/icons/info.svg' title={title} alt={title} />
            </button>
        </div>
    );
});

export default ButtonUpdateInfo;
