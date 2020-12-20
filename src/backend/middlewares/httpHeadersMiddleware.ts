import { NextHandleFunction } from '../interfaces';
import configHttpHeaders from '../config/httpHeaders';

export interface HttpHeadersMiddlewareProps {
    [key: string]: unknown;
}

const httpHeadersMiddleware = (options?: HttpHeadersMiddlewareProps): NextHandleFunction => {
    const headers: HttpHeadersMiddlewareProps = {
        ...configHttpHeaders,
        ...(options ?? {}),
    };

    return (req, res, next) => {
        Object.keys(headers).forEach((key) => {
            const accessControl = headers[key];

            res.setHeader(key, typeof accessControl === 'function' ? accessControl(req, res, next) : accessControl);
        });

        next();
    };
};

export default httpHeadersMiddleware;
