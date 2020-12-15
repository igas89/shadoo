import { select } from 'redux-saga/effects';
import { RootState } from 'store';

export const getToken = function* () {
    const token = yield select(({ authState }: RootState) => authState.response_data.data?.token);
    return token;
};