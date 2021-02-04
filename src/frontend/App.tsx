import React, { FC } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import Breadcrumbs from 'components/Breadcrumbs';
import Header from 'components/Header';
import BaseModal from 'components/Modal/BaseModal';
import WebSocketProvider from 'components/WebSocketProvider';
import Content from 'pages/Content';
import store from 'store';

import 'styles/application.scss';

const App: FC = () => (
    <Provider store={store}>
        <Router>
            <WebSocketProvider >
                <Header />
                <Breadcrumbs />
                <Content />
                <BaseModal />
            </WebSocketProvider>
        </Router>
    </Provider>
);

export default App;
