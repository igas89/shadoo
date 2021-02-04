import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { TOKEN } from '../config/application';

export type ValidateToken = string;

export const getToken = (request: Request): string | string[] | undefined => request.headers['x-access-token'];

export const validateToken = (token: string): Promise<ValidateToken> =>
    new Promise<ValidateToken>((resolve, reject): void => {
        if (!token) {
            reject({
                code: 401,
                message: 'Некорректный токен',
            });
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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