
import { Request, Response, NextFunction } from 'express';


interface expressRequest extends Request {
    method: string;
}
export default abstract class BaseHandler {
    protected request: expressRequest;
    protected response: Response;
    protected next: NextFunction;

    constructor(request: expressRequest, response: Response, next: NextFunction) {
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