import express, { Application } from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import crsf from 'csurf';

import httpHeadersMiddleware from '../middlewares/httpHeadersMiddleware';
import routeHandlerMiddleWare from '../middlewares/routeHandlerMiddleWare';

import { HandlersList, NextHandleFunction } from '../interfaces';

class ApplicationApi {
    private app: Application;

    constructor() {
        this.app = express();
        this.initialize();
    }

    private initialize = () => {
        this.app
            .use(httpHeadersMiddleware())
            .use(cookieParser('secret') as NextHandleFunction)
            // .use(session({
            //     secret: 'sssssh! That\'s the secret',
            //     name: 'session',
            //     resave: false,
            //     saveUninitialized: true,
            //     cookie: {
            //         path: '*',
            //         maxAge: 60 * 60 * 1000,
            //         expires: new Date(Date.now() + (3 * 60 * 60 * 1000))
            //     }
            // }) as NextHandleFunction)
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true,
            }))
            .use(helmet() as NextHandleFunction)
        // .use(crsf({ cookie: { key: 'X-CSRF-TOKEN', } }))
    }

    public setStatic = (dist: string): this => {
        this.app.use(express.static(dist));
        return this;
    }

    public setRoutes = (handlersList: HandlersList): this => {
        Object.keys(handlersList).forEach((version) => {
            const handlers = handlersList[version];
            this.app.use(`/${version}`, routeHandlerMiddleWare({ handlers, version }));
        });

        return this;
    }

    public startServer = (port: number, cb: (port: number) => void): void => {
        this.app.listen(port, () => {
            cb(port);
        });
    }

    get App(): Application {
        return this.app;
    }
}

export default new ApplicationApi();