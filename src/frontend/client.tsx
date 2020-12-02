import React, { FC, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'store';

const App: FC = () => {

    return (
        <Provider store={store}>
            <Router>

            </Router>
        </Provider>
    );
};

document.addEventListener("DOMContentLoaded", function (event) {
    ReactDOM.render(<App />, document.querySelector('.app_container'));
});