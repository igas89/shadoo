export type actionStateTypes = string | undefined | null;

export interface ActionTypes<T> {
    type: string;
    response?: {};
    payload?: T;
    error?: string;
}

export interface InitialState<T, U> {
    action: actionStateTypes;
    error: actionStateTypes;
    request_data: T;
    response_data: U;
}