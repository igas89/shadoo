import React, { useEffect } from 'react';
import { InitialState } from 'reducers/types';
import { UseActionHandlers } from 'store';

const useFabricHandlers = <S extends InitialState>(
    actions: string[],
    state: S,
    handlers?: UseActionHandlers<S>
): void => {
    useEffect(() => {
        const [REQUEST, SUCCESS, FAILURE] = actions;

        if (REQUEST === state.action && handlers?.onRequest) {
            handlers.onRequest(state);
        }

        if (SUCCESS === state.action && handlers?.onDone) {
            handlers.onDone(state);
        }

        if (FAILURE === state.action && handlers?.onError) {
            handlers.onError(state);
        }
    }, [state, handlers]);
}

export default useFabricHandlers;