// import { NewsDataResponse } from 'types/handlers';
import BaseHandler from '../../BaseHandler';
// import Storage from '../../../storage';

import PostModels from '../../../models/post.models';

interface NewsHandlerDone {
    start: string;
    end: string;
}

export default class NewsHandler extends BaseHandler<NewsHandlerDone> {
    private _requiredParams = ['start', 'end'];

    private _createErrorMessage = (param: Partial<NewsHandlerDone>[]): string =>
        `Не передан обязательный параметр ${param.join(', ')}`;

    private _isParamsUndefined = (
        params: NewsHandlerDone,
    ): Partial<NewsHandlerDone>[] => this._requiredParams.filter(
        (key) => Object.keys(params).indexOf(key) === -1,
    ) as Partial<NewsHandlerDone>[];

    done<T extends NewsHandlerDone>(params: T): void {
        const undefinedParams = this._isParamsUndefined(params);

        if (undefinedParams.length) {
            this.sendError({
                status: 503,
                code: 503,
                message: this._createErrorMessage(undefinedParams),
            });
            return;
        }

        PostModels.getNews(params.start, params.end)
            .then(async (data) => {
                const pages = await PostModels.getPagesCount();
                const counts = await PostModels.getPostsCount();

                this.sendJson({ counts, data, pages });
            }).catch(err => {
                this.sendError({
                    status: 503,
                    code: 503,
                    message: err,
                });
            });

        // Storage.readFromCache()
        //     .then((response) => {
        //         const start = Number(params.start) === 0 ? 0 : Number(params.start) - 1;
        //         const end = Number(params.end);
        //         const data = response.data.slice(start, end).map<NewsDataResponse>((item) => ({
        //             id: item.id,
        //             url: item.url,
        //             avatar: item.avatar,
        //             author: item.author,
        //             date: item.date,
        //             commentsCount: item.commentsCount,
        //             comments: item.comments,
        //             title: item.title,
        //             description: item.description,
        //             descriptionImage: item.descriptionImage,
        //         }));

        //         this.sendJson({
        //             ...response,
        //             data,
        //         });
        //     })
        //     .catch((error) => {
        //         this.sendError({
        //             status: error.code,
        //             code: error.code,
        //             message: error.message,
        //         });
        //     });
    }
}
