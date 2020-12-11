import fs from 'fs';
import path from 'path';

import { Cfg } from '../helpers/cfg';

const { CACHE_FILE } = Cfg('application');
import { StorageResponse } from '../../types';

interface StorageWriteToCache {
    status?: string;
    message?: string;
    error?: {
        code: string | number;
        message: string;
    }
}
interface StorageReadFromCache {
    data: StorageResponse[];
    counts: number;
    pages: number;
}

class Storage {
    private filePath: string;

    constructor(filePath: string) {
        this.filePath = path.resolve(__dirname, `../../../cache/${filePath}`);;
    }

    private _errorLog({ message, method }: {
        message: string;
        method: string
    }): void {
        console.error(` --->> [Storage ERROR] ${method} - ${message}`);
    }

    readFromCache(): Promise<StorageReadFromCache> {
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(this.filePath)) {
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

            fs.readFile(this.filePath, 'utf8', (error, rawData) => {
                if (error) {
                    this._errorLog({
                        message: error.message,
                        method: 'readFromCache',
                    });
                    reject(error);
                    return;
                }

                try {
                    const data: StorageResponse[] = JSON.parse(rawData);
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

            console.log(`\n --->> Пишем в файл ${this.filePath}`);

            fs.writeFile(this.filePath, JSON.stringify(data, null, 4), (error) => {
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

                const message = `Записано в кеш: ${dataLength} постов`;
                console.log(` --->> ${message}\n`);
                
                resolve({
                    status: 'ok',
                    message,
                });
            })
        })
    }
}

export default new Storage(CACHE_FILE);