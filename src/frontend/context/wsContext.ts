import { createContext } from 'react';
import wsClient from 'ws/WebSocketClient';

export interface WsContextType {
    ws: ReturnType<typeof wsClient>;
}

export const WsContext = createContext<WsContextType>({} as WsContextType);