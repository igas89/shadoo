import { 
    SHOW_MODAL,
    HIDE_MODAL,
    HIDE_ALL_MODAL,
 } from 'constants/modals';

export interface ModalActionProps<P = unknown> {
    type: string;
    props: P;
}

export type ActionModal<P = unknown> = {
    type: string;
    payload?: ModalActionProps<P>;
};

export const showModalType = <P>(payload: ModalActionProps<P>): ActionModal<P> => ({
    type: SHOW_MODAL,
    payload,
});

export const hideModalType = <P>(payload?: ModalActionProps<P>): ActionModal<P> => ({
    type: HIDE_MODAL,
    payload,
});

export const hideAllModalType = (): Pick<ActionModal, 'type'> => ({
    type: HIDE_ALL_MODAL,
});
