import express, { Application } from 'express';
import * as http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import path from 'path';

import createWebSocketServer from '../../ws/WebSocketServer';
import httpHeadersMiddleware from '../middlewares/httpHeadersMiddleware';
import routeHandlerMiddleWare from '../middlewares/routeHandlerMiddleWare';
import validateTokenMiddleWare from '../middlewares/validateTokenMiddleWare';

import { OUTPUT_DIR } from '../config/application';
import { HandlersList, NextHandleFunction } from '../interfaces';

type App = Application;
type Wss = ReturnType<typeof createWebSocketServer>;

class ApplicationServer {
    private _app: App;

    private _server: http.Server;

    private _wss: Wss;

    constructor() {
        this._app = express();
        this._server = http.createServer(this._app);
        this._wss = createWebSocketServer({
            clientTracking: true,
            noServer: true,
            server: this._server,
        });

        this.initialize();
    }

    private initialize(): void {
        this._app
            .use(httpHeadersMiddleware())
            .use(cookieParser('secret') as NextHandleFunction)
            .use(bodyParser.json())
            .use(
                bodyParser.urlencoded({
                    extended: true,
                }),
            )
            .use(helmet() as NextHandleFunction);
    }

    public setStatic(dist: string): this {
        this._app.use(express.static(dist));
        return this;
    }

    public setRoutes(handlersList: HandlersList): this {
        Object.keys(handlersList).forEach((version) => {
            const handlers = handlersList[version];
            this._app.use(`/${version}`, validateTokenMiddleWare, routeHandlerMiddleWare({ handlers, version }));
        });

        this._app.use('*', (req, res) => {
            res.sendFile(path.resolve(OUTPUT_DIR, 'index.html'));
        });
        return this;
    }

    public startServer(port: number, cb: (port: number) => void): void {
        this._server.listen(port, () => {
            cb(port);
        });
    }

    get app(): App {
        return this._app;
    }
    
    get server(): http.Server {
        return this._server;
    }

    get wss(): Wss {
        return this._wss;
    }
}

export default new ApplicationServer();
