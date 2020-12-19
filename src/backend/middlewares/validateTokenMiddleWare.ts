import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { TOKEN } from '../config/application';

export default function validateTokenMiddleWare(request: Request, response: Response, next: NextFunction): void {
    const token = request.headers['x-access-token'] as string;

    const validateToken = (token: string): Promise<unknown> =>
        new Promise((resolve, reject) => {
            if (request.url === '/auth') {
                return resolve('ok');
            }

            if (!token) {
                return reject({
                    code: 401,
                    message: 'Некорректный токен',
                });
            }

            jwt.verify(token, TOKEN.secret, (err, decode) => {
                if (err) {
                    return reject({
                        code: 400,
                        message: 'Невалидный токен',
                    });
                }

                resolve('ok');
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
