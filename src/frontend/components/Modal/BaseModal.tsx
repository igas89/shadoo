import React, { FC, useEffect, useState } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { RootState } from 'store';
import { ModalMapState } from 'reducers/modalReducer';
import { ModalList, ModalsListType } from 'utils/Modal';

import { initialModals } from 'modals';

const BaseModals: FC = () => {
    const [modals, setModals] = useState<ModalsListType[]>([]);
    const modalState = useSelector<RootState, ModalMapState>(({ modalState }) => modalState, shallowEqual);

    useEffect(() => {
        initialModals();
    }, []);

    useEffect(() => {
        const modals = ModalList.getModals(modalState);
        setModals(modals);
    }, [modalState]);

    return (
        <div className='modal__container'>
            {modals}
        </div>
    );
};

export default BaseModals;