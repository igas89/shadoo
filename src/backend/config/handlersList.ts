import { ExpressMethod, HandlersList } from '../interfaces';

export const DEFAULT_HANDLER_MOTHOD: ExpressMethod = 'all';

/**
 * Конфиг хендлеров и маршрутов к ним
 *
 * @type {Object}
 * @property {string} api наименование хендлера
 * @property {string} endpoin url муршрут к хендлеру
 * @property {(string|string[])} method протокол запроса: default all
 */
export const handlersList: HandlersList = {
    v1: [
        {
            api: 'auth',
            endpoint: '/auth',
            method: 'post',
        },
        {
            api: 'news',
            endpoint: '/news',
            method: ['get', 'post', 'put', 'delete'], // Пример использования нескольких методов на обработчик
        },
        {
            api: 'post',
            endpoint: '/post',
            method: 'get',
        },
        {
            api: 'tags',
            endpoint: '/tags',
            method: 'get',
        },
        {
            api: 'updateNews',
            endpoint: '/update',
            method: 'post',
        },
        {
            api: 'lastComments',
            endpoint: '/lastComments',
            method: 'get',
        },
    ],
};
