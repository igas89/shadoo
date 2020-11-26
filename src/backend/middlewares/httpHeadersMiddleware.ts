import { NextHandleFunction } from '../interfaces';
import configHttpHeaders from '../config/httpHeaders';

export interface httpHeadersMiddlewareProps<T = any> {
    [key: string]: T;
}

export interface HttpHeadersMiddleware {
    (options?: httpHeadersMiddlewareProps): NextHandleFunction;
}

const httpHeadersMiddleware: HttpHeadersMiddleware = (options) => {
    const headers: httpHeadersMiddlewareProps<any> = {
        ...configHttpHeaders,
        ...(options ?? {}),
    };

    return (req, res, next) => {
        Object.keys(headers).forEach((key) => {
            const accessControl = headers[key];

            res.setHeader(key, typeof accessControl === 'function'
                ? accessControl(req, res, next)
                : accessControl
            );
        });

        next();
    }
};

export default httpHeadersMiddleware;