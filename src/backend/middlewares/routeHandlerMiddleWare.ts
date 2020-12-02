import path from 'path';
import express, { Router } from 'express';

import { color, getRequestData } from '../helpers/common';
import { HandlersListData } from '../interfaces';

export interface RouteHandlerMiddleWareProps {
    version: string;
    handlers: HandlersListData[];
}

interface WriteLog {
    message: string;
    isCloseLog: boolean;
    isError?: boolean;
}

class routeLogger {
    private state: Record<string, any> = {};

    createLogger(message: string): void {
        this.state = {
            initialLog() {
                console.group(`\n * [ ${color.сyan}${message}${color.white} ] *`);
            },
            message: '',
            endLog() {
                console.groupEnd();
            }
        }
    }

    writeLog({ message, isError = false, isCloseLog = false }: WriteLog): void {
        const prefix = isError
            ? `${color.red} --->${color.yellow}`
            : `${color.green} --->${color.white}`;

        if (typeof this.state.initialLog === 'function' && !this.state.message) {
            this.state.initialLog();
        }

        this.state.message = message;
        console.log(`${prefix} ${this.state.message}${color.white}`);

        if (isCloseLog) {
            this.state.endLog();
        }
    }
}

const methodsToString = (methods: HandlersListData['method']) => {
    if (typeof methods === 'string') {
        return methods.toUpperCase();
    }

    return methods.map(method => method.toUpperCase()).join(', ');
}

export default function routeHandlerMiddleWare({ version, handlers }: RouteHandlerMiddleWareProps): Router {
    const router = express.Router();
    const logger = new routeLogger();
    const handlersLength = handlers.length - 1;

    logger.createLogger(`Загружаем api обработчика: ${version}`);

    handlers.forEach(({ api, endpoint, method }, index) => {
        const url = `/${version}${endpoint}`;
        const pathHandle = path.resolve(__dirname, `../handlers/${version}/${api}`);
        const isCloseLog = handlersLength === index;
        const messageMethod = `${color.white} - [ ${color.green}${methodsToString(method)}${color.white} ]`;

        const loadedHandler = import(pathHandle)
            .then(({ default: handler }) => {
                const message = `Загружен обработчик: ${pathHandle}${messageMethod}`;
                logger.writeLog({ message, isCloseLog })

                return handler;
            })
            .catch(error => {
                const message = `Не найден модуль обработчика: ${pathHandle}${messageMethod}`;
                logger.writeLog({ message, isError: true, isCloseLog });

                return { error };
            })

        if (!Array.isArray(method)) {
            method = [method];
        }

        if (!(endpoint instanceof RegExp) && !/^\/[a-zA-Z\/]+/.test(endpoint)) {
            endpoint = `/${endpoint}`;
        }

        method.forEach((item) => {
            router[item](endpoint, (request, response, next) => {
                loadedHandler
                    .then((handler) => {
                        if (handler.error) {
                            return Promise.reject(handler.error);
                        }

                        new handler(request, response, next).done(getRequestData(request));
                    })
                    .catch((error) => {
                        // console.error("\n --->> loadHandlers Error:", error);

                        response.status(500);
                        response.send({
                            error: {
                                code: 500,
                                message: `Cannot find module ${url}`,
                                data: error
                            },
                        });
                    });
            });
        })
    });

    return router;
};