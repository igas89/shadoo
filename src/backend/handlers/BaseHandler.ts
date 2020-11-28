
import { Request, Response, NextFunction } from 'express';

export default abstract class BaseHandler {
    protected request: Request;
    protected response: Response;
    protected next: NextFunction;

    constructor(request: Request, response: Response, next: NextFunction) {
        this.request = request;
        this.response = response;
        this.next = next;
    }

    abstract done(data: any): void;

    protected send(params = {}) {
        this.response
            .status(200)
            .send(params);
    }

    protected sendJson(params = {}) {
        this.response
            .status(200)
            .json(params);
    }

    protected sendError(params: Record<string, any>) {
        this.response
            .status(405)
            .send({
                error: {
                    code: 500,
                    message: 'Сервис временно не доступен',
                    ...params,
                    data: params?.data || [],
                },
            });
    }
}