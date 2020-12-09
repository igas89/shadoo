
import { Request, Response, NextFunction } from 'express';


interface expressRequest extends Request {
    method: string;
}
export interface SendError {
    code: number;
    message: string;
    data: unknown[];
}

export default abstract class BaseHandler<P = never> {
    protected request: expressRequest;
    protected response: Response;
    protected next: NextFunction;

    constructor(request: expressRequest, response: Response, next: NextFunction) {
        this.request = request;
        this.response = response;
        this.next = next;
    }

    abstract done<T extends P>(params: T): void;

    protected send(params: unknown): void {
        this.response
            .status(200)
            .send(params);
    }

    protected sendJson(params: unknown): void {
        this.response
            .status(200)
            .json(params);
    }

    protected sendError(params: Partial<SendError>): void {
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