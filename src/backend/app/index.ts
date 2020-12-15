import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import httpHeadersMiddleware from '../middlewares/httpHeadersMiddleware';
import routeHandlerMiddleWare from '../middlewares/routeHandlerMiddleWare';
import validateTokenMiddleWare from '../middlewares/validateTokenMiddleWare';

import { HandlersList, NextHandleFunction } from '../interfaces';

class ApplicationServer {
    private _app: Application;

    constructor() {
        this._app = express();
        this.initialize();
    }

    private initialize(): void {
        this._app
            .use(httpHeadersMiddleware())
            .use(cookieParser('secret') as NextHandleFunction)
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true,
            }))
            .use(helmet() as NextHandleFunction)
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

        return this;
    }

    public startServer(port: number, cb: (port: number) => void): void {
        this._app.listen(port, () => {
            cb(port);
        });
    }

    get app(): Application {
        return this._app;
    }
}

export default new ApplicationServer();