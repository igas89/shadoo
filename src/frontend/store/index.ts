import { createStore, applyMiddleware, combineReducers } from 'redux';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import allReducers from 'reducers';
import rootSaga from '../sagas';

const sagaMiddleware = createSagaMiddleware();
const createStoreWithMiddleware = applyMiddleware(sagaMiddleware /* logger */)(createStore);

const rootReducer = combineReducers(allReducers);
const store = createStoreWithMiddleware(
    rootReducer,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
);

export type RootState = ReturnType<typeof rootReducer>;
export interface UseActionHandlers<TState> {
    onRequest?: (state: TState) => void | boolean;
    onDone?: (state: TState) => void | boolean;
    onError?: (state: TState) => void | boolean;
}

export type Action = { type: string };
export const actionDispatch = (type: Action): Action => store.dispatch(type);

export const SagaRun = sagaMiddleware.run;
export default store;

sagaMiddleware.run(rootSaga);
