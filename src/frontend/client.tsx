import React, { FC, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'store';

import Header from 'pages/Header';
import Content from 'pages/Content';

import 'styles/application.scss';

const App: FC = () => {
    return (
        <Provider store={store}>
            <Router>
                <Header />
                <Content />
            </Router>
        </Provider>
    );
};

document.addEventListener("DOMContentLoaded", (event: Event) => {
    ReactDOM.render(<App />, document.querySelector('.app'));
});