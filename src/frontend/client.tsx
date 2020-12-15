import React from 'react';
import ReactDOM from 'react-dom';
import { put, take } from 'redux-saga/effects';

import App from 'components/App';

import { SagaRun } from 'store';
import { getAuthType, AUTH_SUCCESS } from 'actions/authActions';
import { getAppContainer, delay } from 'helpers/Promise';

const application = function* () {
    const container = yield getAppContainer;
    yield put(getAuthType());
    yield take(AUTH_SUCCESS);

    ReactDOM.render(<App />, container);
}

SagaRun(application);