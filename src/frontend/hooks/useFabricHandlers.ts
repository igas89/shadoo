import React, { useEffect } from 'react';
import { InitialState } from 'reducers/types';
import { UseActionHandlers } from 'store';

const useFabricHandlers = <S extends InitialState>(
    actions: string[],
    state: S,
    handlers?: UseActionHandlers<S>,
): void => {
    useEffect(() => {
        const [REQUEST, SUCCESS, FAILURE] = actions;

        if (!handlers) {
            return;
        }

        const { onRequest, onDone, onError } = handlers;

        if (REQUEST === state.action && onRequest) {
            onRequest(state);
        }

        if (SUCCESS === state.action && onDone) {
            onDone(state);
        }

        if (FAILURE === state.action && onError) {
            onError(state);
        }
    }, [actions, state, handlers]);
};

export default useFabricHandlers;
