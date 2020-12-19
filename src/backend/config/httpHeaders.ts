import { Request, Response, NextFunction } from 'express';

export default {
    'Access-Control-Allow-Origin': (req: Request, res: Response, next: NextFunction) =>
        req.headers.origin || req.headers.host,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Origin, Set-Cookie, X-Requested-With, Content-Type, Accept, X-CSRF-TOKEN',
    'Access-Control-Allow-Credentials': true,
    'Content-Security-Policy': (req: Request, res: Response, next: NextFunction) =>
        `connect-src 'self' ${req.headers.origin || req.headers.host}`,
    // 'Content-Security-Policy': 'default-src *; connect-src *',
    // 'X-Content-Security-Policy': 'default-src *; connect-src *',
};
