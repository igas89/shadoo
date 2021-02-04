/* eslint-disable no-console */
import Emitter from 'component-emitter';

interface WsClient extends Emitter {
    emitEvent(event: string, ...args: unknown[]): void;
    reconnect(): void;
    readonly isConnected: boolean;
    readonly socket: WebSocket;
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
        const socket = new WebSocket(`${url}?token=${token}`);

        socket.onopen = () => {
            console.log(`Соединение установлено: ${url}`);
            this._isConnect = true;
            this.emit('onConnect', socket);
        };

        this.onClose(socket);
        this.onMessage(socket);
        this.onError(socket);

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

    private onClose(socket: WebSocket): void {
        socket.onclose = (event) => {
            this.emit('onClose', event);
            this._isConnect = false;

            if (event.wasClean) {
                console.log('Соединение закрыто чисто');
            } else {
                console.log('Обрыв соединения'); // например, "убит" процесс сервера
            }
            console.log(`Код: ${event.code} причина: ${event.reason}`);
        };
    }

    private onMessage(socket: WebSocket): void {
        socket.onmessage = (event) => {
            const [handle, data] = JSON.parse(event.data);
            this.emit(handle, data);
        };
    }

    private onError(socket: WebSocket): void {
        socket.onerror = (event) => {
            console.error('Ошибка', event);
            this.emit('onError', event);
        };
    }
}

export default (url: string, token: string): WsClient => new WebSocketClient(url, token);