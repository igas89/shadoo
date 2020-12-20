import fs from 'fs';
import path from 'path';
import { color } from './common';

import { HandlersList } from '../interfaces';
import { DEFAULT_HANDLER_MOTHOD, handlersList } from '../config/handlersList';

export const getHandlersList = (): Required<HandlersList> =>
    Object.keys(handlersList).reduce((acc, version) => {
        acc[version].forEach((handler) => {
            if (!handler.method) {
                handler.method = DEFAULT_HANDLER_MOTHOD;
            }
        });

        return acc;
    }, handlersList);

export const getHandlersVersion = (): (keyof HandlersList)[] => Object.keys(handlersList);

/* TODO: доработать типы */
export const Cfg = (fileName: string): Record<string, unknown> => {
    const pathFile: string = path.resolve(__dirname, `../config/${fileName}.ts`);

    if (!fs.existsSync(pathFile)) {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw `\n ${color.red}--->> ${color.yellow}Не найден файл конфига ${pathFile}${color.white}`;
    }

    // console.log(`\n ${color.green}--->> Загружен файл конфига ${fileName}.ts${color.white}`);

    const { ...config } = require(pathFile);

    console.log('config:', config);
    return config;
};
