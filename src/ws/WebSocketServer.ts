/* eslint-disable no-console */
import WebSocket from 'ws';
import querystring from 'querystring';

import { validateToken } from '../backend/helpers/validateToken';

import { WS_CONNECT_ERROR } from './constants';

export interface WsSocket extends WebSocket {
    uid: string;
    emitEvent: (event: string, ...args: unknown[]) => void;
}

export type WebSocketServerProps = WebSocket.ServerOptions;

export interface WsCallback {
    (this: WebSocketServer, socket: WsSocket): void;
}

export class WebSocketServer {
    private _wss: WebSocket.Server;

    private clients = new Map<string, WsSocket>();

    private events = new Map<string, (...args: unknown[]) => void>();

    constructor(options?: WebSocketServerProps) {
        this._wss = new WebSocket.Server(options);
    }

    public initializeServer(callback?: WsCallback): void {
        this._wss.on('connection', async (socket: WsSocket, req) => {
            try {
                const url = querystring.parse(req.url as string);
                const [uid] = Object.values<string>(Array.isArray(url) ? url[0] : url);

                await validateToken(uid);

                socket.uid = uid;
                socket.emitEvent = this.emitEvent.bind(socket);

                this.clients.set(uid, socket);

                if (callback) {
                    callback.apply(this, [socket]);
                }

                this.registerEvents(socket);
                this.onMessage(socket);
                this.onClose(socket);
                this.onError(socket);
            } catch (error) {
                socket.send(JSON.stringify([WS_CONNECT_ERROR, error]));
            }
        });
    }

    public on(event: string, listener: (...args: unknown[]) => void): this {
        this.events.set(event, listener);
        return this;
    }

    public off(event: string): this {
        this.events.delete(event);
        return this;
    }

    public getClients(): Map<string, WsSocket> {
        return this.clients;
    }

    public getClientSocket(uid: string): WsSocket | undefined {
        return this.clients.get(uid);
    }

    private emitEvent(this: WsSocket, event: string, ...args: unknown[]): void {
        if (this.readyState === WebSocket.OPEN) {
            this.send(JSON.stringify([event, ...args]));
        }
    }

    private registerEvents(socket: WsSocket): void {
        // eslint-disable-next-line no-restricted-syntax
        for (const [event, listener] of this.events.entries()) {
            socket.on(event, listener);
        }
    }

    private onMessage(socket: WsSocket): this {
        socket.on('message', (message) => {
            try {
                const [event, data] = JSON.parse(message as string);
                socket.emit(event, data);
            } catch (error) {
                console.error('[WS: message]', error);
            }
        });

        return this;
    }

    private onClose(socket: WsSocket): this {
        socket.on('close', (code, reason) => {
            const message = { code, reason };
            console.log('[WS: close]', JSON.stringify(message, null, 4));
            this.clients.delete(socket.uid);
        });

        return this;
    }

    private onError(socket: WsSocket): this {
        socket.on('error', (error) => {
            console.error('[WS: error]', error);
        });

        return this;
    }
}

export default function createWebSocketServer(
    options?: WebSocketServerProps,
    callback?: WsCallback,
): WebSocketServer {
    try {
        const wss = new WebSocketServer(options);
        // console.log('[ Create WSS Server ]:', wss);
        wss.initializeServer(callback);
        return wss;
        // eslint-disable-next-line no-console

        // return ({ socket, wss });
    } catch (err) {
        // eslint-disable-next-line no-console
        // console.error('[ Create WSS Server ]:', err);
        return err;
    }
}