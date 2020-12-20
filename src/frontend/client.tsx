import React from 'react';
import ReactDOM from 'react-dom';
import { put, take } from 'redux-saga/effects';

import { SagaRun } from 'store';
import { getAuthType, AUTH_SUCCESS } from 'actions/authActions';
import { getAppContainer } from 'helpers/Promise';
import App from './App';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const application = function* () {
    const container = yield getAppContainer;
    yield put(getAuthType());
    yield take(AUTH_SUCCESS);

    ReactDOM.render(<App />, container);
};

SagaRun(application);
