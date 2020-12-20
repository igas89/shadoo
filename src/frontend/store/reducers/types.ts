export type ActionStateTypes = string | undefined | null;

export type ActionStateError = {
    code: number | null;
    message: string | null;
    data?: unknown[];
};

export interface ActionTypes<T, U> {
    type: string;
    payload?: T;
    response?: U;
    error?: ActionStateError;
}

export interface InitialState<T = unknown, U = unknown> {
    action: ActionStateTypes;
    error: ActionStateError;
    request_data: T;
    response_data: U;
}
