import path from 'path';

/**
 * Порт бэк-сервера
 * @type {number}
 */
export const SERVER_PORT = 3000;

/**
 * Файл хранилище постов
 * @type {string}
 */
export const CACHE_FILE = 'posts.json';

/**
 * Файл базы данных
 * @type {string}
 */
export const DB_FILE = 'database.db';

/**
 * Папка хранения базы данных
 * @type {string}
 */
export const DB_DIR = path.join(process.cwd(), '/cache');

/**
 * Папка бандлов
 * @type {string}
 */
export const OUTPUT_DIR = 'dist';

export const TOKEN = {
    secret: 'SECRET_TOKEN',
    expires: '1h',
};

export const URL_PARSE = 'https://shazoo.ru/news';

/** Конфигурация парсера
 * 
 */
export const PARSER_CONFIG = {
    url: URL_PARSE,
    maxPage: 10,
    requestLimit: 20,
};