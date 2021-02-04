import Emitter from "component-emitter";
import { SERVER_API_URL } from '../config';

interface iWsClient extends Emitter {
    emitEvent(event: string, ...args: any[]): void;
    reconnect(): void;
    readonly isConnected: boolean;
    readonly socket: WebSocket;
}

export class WsClient extends Emitter implements iWsClient {
    private _url: string;
    private _socket: WebSocket;
    private _isConnect: boolean = false;

    constructor(url: string) {
        super();
        this._url = url;
        this._socket = this.connect(this._url)
    }

    private connect(url: string): WebSocket {
        const socket = new WebSocket(url);

        socket.onopen = () => {
            // console.log(`Соединение установлено: ${url}`);
            this._isConnect = true;
            this.emit('onConnect', socket)
        };

        this.onClose(socket);
        this.onMessage(socket);
        this.onError(socket);

        return socket;
    }

    public emitEvent(event: string, ...args: any[]): void {
        if (this.isConnected) {
            this._socket.send(JSON.stringify([event, ...args]));
        }
    }

    public reconnect(): void {
        this._isConnect = false;
        this._socket = this.connect(this._url);
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
            console.log('Код: ' + event.code + ' причина: ' + event.reason);
        };
    }

    private onMessage(socket: WebSocket): void {
        socket.onmessage = (event) => {
            const [handle, data] = JSON.parse(event.data);
            // console.log("Получены данные ", handle, data);

            this.emit(handle, data);
        };
    }

    private onError(socket: WebSocket): void {
        socket.onerror = (event) => {
            console.log("Ошибка " + event);
            this.emit('onError', event);
        };
    }
}

export default (): WsClient => {
    return new WsClient(SERVER_API_URL);
}