import React, { FC, useEffect, useRef } from 'react';

import wsClient, { WsCloseEvent } from 'ws/WebSocketClient';
import { WsContext, WsContextType } from 'context/wsContext';
import { useAuth } from 'actions/authActions/hooks';

const TIMEOUT_RECCONECT = 3000; // 3s
const ABNORMAL_CLOSURE_CODE = 1006; // обрыв соединения

const WebSocketProvider: FC = ({ children }) => {
    const { getToken } = useAuth();
    const token = getToken();
    const wsc = useRef(wsClient(`ws://${document.location.host}/ws`, token));
    const intervalId = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        wsc.current.on('onClose', ({ code }: WsCloseEvent) => {
            if (intervalId.current || code !== ABNORMAL_CLOSURE_CODE) {
                return;
            }

            intervalId.current = setInterval(() => {
                if (wsc.current.isConnected) {
                    clearInterval(intervalId.current as NodeJS.Timeout);
                    intervalId.current = null;
                    return;
                }

                wsc.current.reconnect();
            }, TIMEOUT_RECCONECT);
        });
    }, [wsc, intervalId]);

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