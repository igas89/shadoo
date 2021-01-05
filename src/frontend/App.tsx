import React, { FC } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import Header from 'components/Header';
import Content from 'pages/Content';
import store from 'store';

import 'styles/application.scss';

const App: FC = () => (
    <Provider store={store}>
        <Router>
            <Header />
            <Content />
        </Router>
    </Provider>
);

export default App;
