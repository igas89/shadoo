import express from 'express';

export type ExpressMethod = 'all' | 'get' | 'post' | 'put' | 'delete';
export type NextHandleFunction = (req: express.Request, res: express.Response, next: express.NextFunction) => void;


export interface HandlersListData {
    api: string,
    endpoint: string | RegExp;
    method: ExpressMethod | ExpressMethod[];
}

export interface HandlersList {
    [key: string]: HandlersListData[]
}

export interface iHandler {
    done(req: express.Request, res: express.Response, next: express.NextFunction): void;
}

export interface RouteList {
    [key: string]: express.Router;
}
