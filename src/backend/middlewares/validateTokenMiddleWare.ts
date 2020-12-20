import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { TOKEN } from '../config/application';

export type ValidateToken = { [key: string]: number | string } | string;

export default function validateTokenMiddleWare(request: Request, response: Response, next: NextFunction): void {
    const token = request.headers['x-access-token'] as string;

    const validateToken = (token: string): Promise<ValidateToken> =>
        new Promise<ValidateToken>((resolve, reject): void => {
            if (request.url === '/auth') {
                resolve('ok');
                return;
            }

            if (!token) {
                reject({
                    code: 401,
                    message: 'Некорректный токен',
                });
                return;
            }

            jwt.verify(token, TOKEN.secret, (err, decode): void => {
                if (err) {
                    return reject({
                        code: 400,
                        message: 'Невалидный токен',
                    });
                }

                return resolve('ok');
            });
        });

    validateToken(token)
        .then((result) => {
            next();
        })
        .catch((err) => {
            response.status(err.code).json({
                error: {
                    code: err.code,
                    message: err.message,
                },
            });
        });
}
