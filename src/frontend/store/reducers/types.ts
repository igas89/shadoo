export type actionStateTypes = string | undefined | null;

export interface ActionTypes<T, U> {
    type: string;
    payload?: T;
    response?: U;
    error?: string;
}

export interface InitialState<T = unknown, U = unknown> {
    action: actionStateTypes;
    error: actionStateTypes;
    request_data: T;
    response_data: U;
}