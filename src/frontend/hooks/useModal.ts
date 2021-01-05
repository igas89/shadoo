import { FC, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { ModalMapState } from 'reducers/modalReducer';
import { actionDispatch, RootState } from 'store';

import {
    showModalType,
    hideModalType,
    hideAllModalType,
    ModalActionProps,
} from 'actions/modalsActions';

export interface UseModal {
    showModal: <P = unknown>(type: string, props?: P) => void;
    hideModal: <P = unknown>(props?: ModalActionProps<P>) => void;
    hideAllModal: () => void;
    modalState: ModalMapState;
}

const useModal = (): UseModal => {
    const modalState = useSelector<RootState, ModalMapState>(({ modalState }) => modalState);

    const showModal = useCallback((type: string, props = {}): void => {
        actionDispatch(showModalType({ type, props }));
    }, []);

    const hideModal = useCallback((props?: ModalActionProps): void => {
        actionDispatch(hideModalType(props));
    }, []);

    const hideAllModal = useCallback((): void => {
        actionDispatch(hideAllModalType());
    }, []);

    return {
        showModal,
        hideModal,
        hideAllModal,
        modalState,
    };
};

export default useModal;