import fs from 'fs';
import path from 'path';
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

export const Cfg = (fileName: string): any => {
    const pathFile = path.resolve(__dirname, `../config/${fileName}.ts`);

    if (!fs.existsSync(pathFile)) {
        throw (`\n ${color.red}--->> ${color.yellow}Не найден файл конфига ${pathFile}${color.white}`);
    }

    // console.log(`\n ${color.green}--->> Загружен файл конфига ${fileName}.ts${color.white}`);

    const { ...config } = require(pathFile);
    return config;
}