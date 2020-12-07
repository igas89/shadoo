import fs from 'fs';
import path from 'path';

import { Cfg } from '../helpers/cfg';

const { CACHE_FILE } = Cfg('application');

type StorageWriteToCache = string | {
    error: {
        code: string | number;
        message: string;
    }
}
interface StorageReadFromCache {
    data: unknown[];
    counts: number;
    pages: number;
}

class Storage {
    private _filePath: string;

    constructor(filePath: string) {
        this._filePath = path.resolve(__dirname, `../../../cache/${filePath}`);;
    }

    private _errorLog({ message, method }: {
        message: string;
        method: string
    }): void {
        console.error(` --->> [Storage ERROR] ${method} - ${message}`);
    }

    readFromCache(): Promise<StorageReadFromCache> {
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(this._filePath)) {
                const errorMessage = `Не найден файл кеша`;
                this._errorLog({
                    message: errorMessage,
                    method: 'readFromCache',
                });
                
                reject({
                    code: 404,
                    message: errorMessage,
                });
                return;
            }

            fs.readFile(this._filePath, 'utf8', (error, rawData) => {
                if (error) {
                    this._errorLog({
                        message: error.message,
                        method: 'readFromCache',
                    });
                    reject(error);
                    return;
                }

                try {
                    const data: unknown[] = JSON.parse(rawData);
                    const counts = data.length;
                    
                    resolve({
                        counts,
                        data,
                        pages: counts / 20,
                    });
                } catch (error) {
                    this._errorLog({
                        message: error.message,
                        method: 'readFromCache',
                    });
                    reject(error);
                    return;
                }
            });
        })
    }

    writeToCache(data: unknown[]): Promise<StorageWriteToCache> {
        return new Promise((resolve, reject) => {
            const dataLength = data.length;

            console.log(`\n --->> Пишем в файл ${this._filePath}`);

            fs.writeFile(this._filePath, JSON.stringify(data, null, 4), (error) => {
                if (error) {
                    this._errorLog({
                        message: error.message,
                        method: 'writeFile',
                    });

                    reject({
                        error: {
                            code: error.code,
                            message: error.message,
                        }
                    })
                    return;
                }

                console.log(` --->> Записано в кеш: ${dataLength} постов\n`);
                resolve('ok');
            })
        })
    }
}

export default new Storage(CACHE_FILE);