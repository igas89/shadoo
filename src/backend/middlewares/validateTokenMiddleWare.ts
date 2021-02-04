import { Request, Response, NextFunction } from 'express';
import { validateToken, ValidateToken, getToken } from '../helpers/validateToken';

export default async function validateTokenMiddleWare(
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<ValidateToken> {
    try {
        const token = getToken(request) as string;
        if (request.url === '/auth') {
            next();
            return Promise.resolve('ok');
        }

        const valid = await validateToken(token);
        next();
        return Promise.resolve(valid);
    } catch (err) {
        const error = {
            error: {
                code: err.code,
                message: err.message,
            },
        };

        response
            .status(err.code)
            .json(error);

        return Promise.reject(error);
    }
}
