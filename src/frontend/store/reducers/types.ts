export type actionStateTypes = string | undefined | null;

export type actionStateError = {
    code: number | null;
    message: string | null;
    data?: unknown[];
};

export interface ActionTypes<T, U> {
    type: string;
    payload?: T;
    response?: U;
    error?: actionStateError;
}

export interface InitialState<T = unknown, U = object> {
    action: actionStateTypes;
    error: actionStateError;
    request_data: T;
    response_data: U;
}
