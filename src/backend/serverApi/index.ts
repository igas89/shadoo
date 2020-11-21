import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import crsf from 'csurf';
import httpHeaders from '../middlewares/httpHeaders';

export type NextHandleFunction = (req: express.Request, res: express.Response, next: express.NextFunction) => void;

class ServerApi {
    private app: express.Application;

    constructor() {
        this.app = express();
        this.initialize();
    }

    private initialize = () => {
        this.app
            .use(httpHeaders())
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
            .use(crsf({ cookie: { key: 'X-CSRF-TOKEN', } }))
    }

    get App(): express.Application {
        return this.app;
    }

    public setStatic = (dist: string): this => {
        this.app.use(express.static(dist));
        return this;
    }

    public start = (port: number = 3000): void => {
        this.app.listen(port, () => {
            console.log(`Server started on port http://localhost:${port}/`);
        });
    }
}

export default new ServerApi();