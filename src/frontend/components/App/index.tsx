import React, { FC } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import Header from 'pages/Header';
import Content from 'pages/Content';
import store from 'store';

import './App.scss';

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

export default App;