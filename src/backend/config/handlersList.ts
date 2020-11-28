
import { ExpressMethod, HandlersList } from '../interfaces';

export const DEFAULT_HANDLER_MOTHOD: ExpressMethod = 'all';

/**
   * Конфиг хендлеров и маршрутов к ним
   * 
   * @type {Object}
   * @property {string} api наименование хендлера: autorization
   * @property {string} endpoin url муршрут к хендлеру
   * @property {string} method протокол запроса: default all
 */
export const handlersList: HandlersList = {
    'v1': [
        {
            api: 'categories',
            endpoint: '/categories/:id(\\d+)?/',
            method: 'post',
            // method: 'get',
        },
        {
            api: 'posts',
            endpoint: '/posts',
            // method: 'post',
            method: 'get',
        },
        {
            api: 'theme',
            endpoint: '/theme',
            // method: 'post',
            method: 'get',
        },
    ],
    // 'v2': [
    //     {
    //         api: 'userHandler',
    //         endpoint: '/user',
    //         method: 'all',
    //     },
    //     {
    //         api: 'auth',
    //         endpoint: '/authorizationHandler',
    //         method: 'all',
    //     },
    // ],
    // 'v3': [
    //     {
    //         api: 'userHandler',
    //         endpoint: '/user',
    //         method: 'all',
    //     },
    //     {
    //         api: 'auth',
    //         endpoint: '/authorizationHandler',
    //         method: 'all',
    //     },
    // ],
};
