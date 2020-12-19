export interface ActionSaga<T> {
    type: string;
    payload?: T;
}
