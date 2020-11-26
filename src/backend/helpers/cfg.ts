import fs from 'fs';
import { color } from './common';

import { HandlersList } from '../interfaces';
import { DEFAULT_HANDLER_MOTHOD, handlersList, } from '../config/handlersList';

export const getHandlersList = (): Required<HandlersList> => Object.keys(handlersList).reduce((acc, version) => {
    acc[version].map((handler) => {
        if (!handler.method) {
            handler.method = DEFAULT_HANDLER_MOTHOD;
        }

        handler.method = handler.method.toLowerCase() as typeof handler.method;
        return handler;
    }, {});

    return acc;
}, handlersList);

export const getHandlersVersion = (): (keyof HandlersList)[] => Object.keys(handlersList);

export const Cfg = <T>(fileName: string): T => {
    const path = `${__dirname}/../config/${fileName}.js`;

    if (!fs.existsSync(path)) {
        throw (`\n ${color.red}--->> ${color.yellow}Не найден файл конфига ${path}${color.white}`);
    }

    console.log(`\n ${color.green}--->> Загружен файл конфига ${fileName}.js${color.white}`);
    return require(path).default;
}