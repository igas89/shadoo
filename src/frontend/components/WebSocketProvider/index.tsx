import React, { FC, useRef } from 'react';

import wsClient from 'ws/WebSocketClient';
import { WsContext, WsContextType } from 'context/wsContext';
import { useAuth } from 'actions/authActions/hooks';

const WebSocketProvider: FC = ({ children }) => {
    const { getToken } = useAuth();
    const token = getToken();
    const wsc = useRef(wsClient(`ws://${document.location.host}/ws`, token));

    const providerValues: WsContextType = {
        ws: wsc.current,
    };

    return (
        <WsContext.Provider value={providerValues}>
            {children}
        </WsContext.Provider>
    );
};

export default WebSocketProvider;