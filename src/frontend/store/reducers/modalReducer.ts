import { Map } from 'immutable';
import { ModalActionProps } from 'actions/modalsActions';
import {
    SHOW_MODAL,
    HIDE_MODAL,
    HIDE_ALL_MODAL,
} from 'constants/modals';

export interface ModalAction {
    type: string;
    payload: Partial<ModalActionProps>;
}

export type ModalState<P = unknown> = { action: string; } & ModalActionProps<P> | string;
export type ModalMapState = Map<string, ModalState>;

export const modalReducer = (
    state = Map<string, ModalState>(),
    action: ModalAction,
): ModalMapState => {
    switch (action.type) {
        case SHOW_MODAL: {
            return state.withMutations((map) => {
                const actionModal = action.payload?.type || 'main';

                map.set('active', actionModal)
                    .set(actionModal, {
                        action: action.type,
                        type: action.payload?.type || '',
                        props: action.payload?.props || {},
                    });
            });
        }
        case HIDE_MODAL: {
            return state.withMutations((map) => {
                const key = action.payload?.type || map.get('active');
                map.remove(key as string)
                    .set('active', (map.last() as Pick<ModalAction, 'type'>)?.type || '');
            });
        }
        case HIDE_ALL_MODAL: {
            state.clear();
            return state;
        }
        default:
            return state;
    }
};
