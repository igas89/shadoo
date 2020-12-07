
import { ExpressMethod, HandlersList } from '../interfaces';

export const DEFAULT_HANDLER_MOTHOD: ExpressMethod = 'all';

/**
   * Конфиг хендлеров и маршрутов к ним
   * 
   * @type {Object}
   * @property {string} api наименование хендлера
   * @property {string} endpoin url муршрут к хендлеру
   * @property {string} method протокол запроса: default all
 */
export const handlersList: HandlersList = {
    'v1': [
        {
            api: 'news',
            endpoint: '/news',
            method: ['get', 'post', 'put', 'delete'],
        },
        {
            api: 'post',
            endpoint: '/post',
            method: 'get',
        },
    ],
};
