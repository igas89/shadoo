import { Request, Response, NextFunction } from 'express';

export interface SendError {
    status: number;
    code: number;
    message: string;
    data?: unknown[];
}

export default abstract class BaseHandler<P = never> {
    protected request: Request;

    protected response: Response;

    protected next: NextFunction;

    constructor(request: Request, response: Response, next: NextFunction) {
        this.request = request;
        this.response = response;
        this.next = next;
    }

    abstract done<T extends P>(params: T): void;

    protected send(params: unknown): void {
        this.response.status(200).send(params);
    }

    protected sendJson(params: unknown): void {
        this.response.status(200).json(params);
    }

    protected sendError(params: SendError): void {
        const { status, ...error } = params;

        this.response.status(status || 500).json({
            error: {
                code: error.code || 500,
                message: error.message || 'Сервис временно не доступен',
                data: error.data || [],
            },
        });
    }
}
