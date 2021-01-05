import React, { FC, ReactNode } from 'react';
import { Map } from 'immutable';
import { ModalMapState } from 'reducers/modalReducer';

export interface RegisterModalCallback<T> {
    (modal: { action: string; type: string, props: T }): React.ReactElement<T>
}

export type ModalsListType = FC | ReactNode;

class ModalListClass {
    private list = Map<string, RegisterModalCallback<unknown>>();

    public registerModal<P>(type: string, cb: RegisterModalCallback<P>): this {
        this.list = this.list.set(type, cb as RegisterModalCallback<unknown>);
        return this;
    }

    public getModals(modalState: ModalMapState): ModalsListType[] {
        const modals: ModalsListType[] = [];
        modalState.forEach((modal, key): void => {
            if (key === 'active' || typeof modal === 'string') {
                return;
            }

            if (this.list.has(key)) {
                const callback = this.list.get(key) as RegisterModalCallback<unknown>;
                modals.push(callback(modal));
            }
        });

        return modals;
    }
}

export const ModalList = new ModalListClass();