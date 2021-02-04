import WebSocket from 'ws';

export interface WSocket extends WebSocket {
    emitEvent: (event: string, ...args: any[]) => void;
};

export interface WsCallback {
    (socket: WSocket): void;
}

export class WsServer {
    private wss: WebSocket.Server;
    private _clients = new Set<WebSocket>();
    private events = new Map<string, (...args: any[]) => void>();

    constructor(options: WebSocket.ServerOptions) {
        this.wss = new WebSocket.Server(options);
    }

    public initializeServer(callback: WsCallback): void {
        this.wss.on("connection", (socket: WSocket) => {
            this._clients.add(socket);
            socket.emitEvent = this.emitEvent.bind(socket);

            this.registerEvents(socket);
            this.onMessage(socket);
            this.onClose(socket);
            this.onError(socket);

            callback(socket);
        });
    }

    public on(event: string, listener: (...args: any[]) => void): this {
        this.events.set(event, listener);
        return this;
    }

    public off(event: string): this {
        this.events.delete(event);
        return this;
    }

    public get clients(): Set<WebSocket> {
        return this._clients;
    }

    private emitEvent(this: WSocket, event: string, ...args: any[]): void {
        if (this.readyState === WebSocket.OPEN) {
            this.send(JSON.stringify([event, ...args]));
        }
    }

    private registerEvents(socket: WebSocket): void {
        for (let item of this.events) {
            const [event, listener] = item;
            socket.on(event, listener);
        }
    }

    private onMessage(socket: WebSocket): this {
        socket.on('message', (message) => {
            try {
                const [event, data] = JSON.parse(message as string);
                socket.emit(event, data)
            } catch (error) {
                console.error('[WS: message]', error);
            }
        });

        return this;
    }

    private onClose(socket: WebSocket): this {
        socket.on('close', (code, reason) => {
            this._clients.delete(socket);

            const message = { code, reason };

            console.log('[WS: close]', JSON.stringify(message, null, 4));
        });

        return this;
    }

    private onError(socket: WebSocket): this {
        socket.on('error', (error) => {
            console.error('[WS: error]', error);
        });

        return this;
    }
}

export default (options: WebSocket.ServerOptions, callback: WsCallback): WsServer => {
    const wss = new WsServer(options);
    wss.initializeServer(callback)
    return wss;
}