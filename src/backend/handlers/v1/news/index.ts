import BaseHandler from '../../BaseHandler';
import Storage from '../../../storage';

import { StorageResponse } from '../../../interfaces';
interface NewsHandlerDone {
    start: string;
    end: string;
}

type Data = Omit<StorageResponse, 'content' | 'page' | 'image'>[];
export default class NewsHandler extends BaseHandler<NewsHandlerDone> {
    private _requiredParams = ['start', 'end'];

    private _createErrorMessage = (param: Partial<NewsHandlerDone>[]): string => `Не передан обязательный параметр ${param.join(', ')}`;
    private _isParamsUndefined = (params: NewsHandlerDone): Partial<NewsHandlerDone>[] => {
        return this._requiredParams.filter(key => Object.keys(params).indexOf(key) === -1) as Partial<NewsHandlerDone>[];
    }

    done<T extends NewsHandlerDone>(params: T) {
        let undefinedParams = this._isParamsUndefined(params);

        // console.log(this.request.method)

        if (undefinedParams.length) {
            this.sendError({
                code: 503,
                message: this._createErrorMessage(undefinedParams),
            });
            return;
        }

        Storage.readFromCache()
            .then((response) => {
                const start = Number(params.start) === 0 ? 0 : Number(params.start) - 1;
                const end = Number(params.end);
                const data: Data = response.data.slice(start, end).map((item) => ({
                    id: item.id,
                    url: item.url,
                    avatar: item.avatar,
                    author: item.author,
                    date: item.date,
                    comments: item.comments,
                    title: item.title,
                    description: item.description,
                    descriptionImage: item.descriptionImage,
                }));

                this.sendJson({
                    ...response,
                    data,
                });
            })
            .catch(error => {
                this.sendError({
                    code: error.code || 503,
                    message: error.message,
                });
            })

    }
}

