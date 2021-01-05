
import React from 'react';
import { ModalList } from 'utils/Modal';
import * as types from 'constants/modals';

import UpdateNewsModal, { UpdateNewsModalProps } from './components/UpdateNewsModal';

export const initialModals = (): void => {
    ModalList
        .registerModal<UpdateNewsModalProps>(
            types.UPDATE_NEWS_MODAL,
            ({ type, props }) => <UpdateNewsModal key={type} {...props} />,
        );
};