import { Request, Response, NextFunction } from 'express';
import configHttpHeaders from '../config/httpHeaders';

export interface httpHeadersProps<T = any> {
    [key: string]: T;
}

export interface HttpHeaders {
    (options?: httpHeadersProps): (req: Request, res: Response, next: NextFunction) => void;
}

const httpHeaders: HttpHeaders = (options) => (req, res, next) => {
    const headers: httpHeadersProps<any> = {
        ...configHttpHeaders,
        ...(options ?? {}),
    };

    Object.keys(headers).forEach((key) => {
        const accessControl = headers[key];

        res.setHeader(key, typeof accessControl === 'function'
            ? accessControl(req, res, next)
            : accessControl
        );
    });

    next();
};

export default httpHeaders;