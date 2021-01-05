import React, { FC, memo, ReactNode, useCallback, useEffect, useMemo, useRef } from 'react';
import useModal from 'hooks/useModal';
import './Modal.scss';

export type OnCloseEvent = React.MouseEvent<HTMLDivElement | HTMLButtonElement>;

export interface ModalProps {
    title: ReactNode,
    children: ReactNode;
    btnClose: boolean,
    onClose(event?: OnCloseEvent): void;
    className: string;
    bodyClass: string;
    contentClass: string;
}

const Modal: FC<Partial<ModalProps>> = memo(({
    title,
    children,
    btnClose = true,
    onClose,
    className = '',
    bodyClass = '',
    contentClass = '',
}) => {
    const { hideModal, modalState } = useModal();
    const bodyRef = useRef(document.querySelector('body') as HTMLBodyElement);

    const setOverflowStyle = useCallback((overflow: string) => {
        bodyRef.current.style.overflow = overflow;
    }, []);

    const onCloseModal = useCallback((event: OnCloseEvent) => {
        event.persist();

        if (onClose) {
            onClose(event);
        }

        hideModal();
    }, [onClose, hideModal]);

    useEffect(() => {
        setOverflowStyle('hidden');
    }, [setOverflowStyle]);

    useEffect(() => () => {
        if (modalState.size > 1) {
            return;
        }
        setOverflowStyle('auto');
    }, [modalState, setOverflowStyle]);

    const containerClass = useMemo(() => `modal ${className}`.trim(), [className]);
    const containerBodyClass = useMemo(() => `modal__body ${bodyClass}`.trim(), [bodyClass]);
    const containerContentClass = useMemo(() => `modal__content ${contentClass}`.trim(), [contentClass]);

    return (
        <div className={containerClass}>
            <div className={containerBodyClass}>
                {btnClose && <button type='button' className='modal__close' title='закрыть' onClick={onCloseModal} />}
                {title && <div className='modal__title'>{title}</div>}
                {children && <div className={containerContentClass}>{children}</div>}
            </div>
            <div className='modal__background' onClick={onCloseModal} />
        </div>
    );
});

export default Modal;