/* eslint-disable no-console */
import Emitter from 'component-emitter';

export interface WsClient extends Emitter {
    emitEvent(event: string, ...args: unknown[]): void;
    reconnect(): void;
    readonly isConnected: boolean;
    readonly socket: WebSocket;
}

export type WsCloseEvent = CloseEvent;
export interface OnConnectProps {
    event: Event,
    socket: WebSocket,
}

export class WebSocketClient extends Emitter implements WsClient {
    private _url: string;

    private _socket: WebSocket;

    private _isConnect = false;

    private token = '';

    constructor(url: string, token: string) {
        super();
        this._url = url;
        this.token = token;
        this._socket = this.connect(this._url, token);
    }

    private connect(url: string, token: string): WebSocket {
        // eslint-disable-next-line no-multi-assign
        const socket = this._socket = new WebSocket(`${url}?token=${token}`);

        this.onOpen(url)
            .onClose()
            .onMessage()
            .onError();

        return socket;
    }

    public emitEvent(event: string, ...args: unknown[]): void {
        if (this.isConnected) {
            this._socket.send(JSON.stringify([event, ...args]));
        }
    }

    public reconnect(): void {
        this._isConnect = false;
        this._socket = this.connect(this._url, this.token);
    }

    get isConnected(): boolean {
        return this._isConnect;
    }

    get socket(): WebSocket {
        return this._socket;
    }

    private onOpen(url: string): this {
        this._socket.onopen = (event: Event) => {
            this._isConnect = true;
            this.emit('onConnect', { event, socket: this._socket });
            console.log(`WS: Соединение установлено: ${url}`);
        };

        return this;
    }

    private onClose(): this {
        this._socket.onclose = (event) => {
            this._isConnect = false;
            this.emit('onClose', event);

            const errorMessage = event.wasClean
                ? 'Соединение закрыто чисто'
                : 'Обрыв соединения'; // например, "убит" процесс сервера
          
            console.error(`WS: ${errorMessage}`, {
                code: event.code,
                reason: event.reason,
            });
        };

        return this;
    }

    private onMessage(): this {
        this._socket.onmessage = (event) => {
            const [handle, data] = JSON.parse(event.data);
            this.emit(handle, data);
        };

        return this;
    }

    private onError(): this {
        this._socket.onerror = (event) => {
            this._isConnect = false;
            this.emit('onError', event);
            console.error('WS: Error', event);
        };

        return this;
    }
}

export default (url: string, token: string): WsClient => new WebSocketClient(url, token);