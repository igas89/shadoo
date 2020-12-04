import BaseHandler from '../../BaseHandler';
import Storage from '../../../storage';

interface NewsHandlerDone {
    start: string;
    end: string;
}
export default class NewsHandler extends BaseHandler {
    private _requiredParams = ['start', 'end'];

    private _createErrorMessage = (param: Partial<NewsHandlerDone>[]): string => `Не передан обязательный параметр ${param.join(', ')}`;
    private _isParamsUndefined = (params: NewsHandlerDone): Partial<NewsHandlerDone>[] => {
        return this._requiredParams.filter(key => Object.keys(params).indexOf(key) === -1) as Partial<NewsHandlerDone>[];
    }

    done(params: NewsHandlerDone) {
        let undefinedParams = this._isParamsUndefined(params);

        // console.log(this.request.method)
        
        if (undefinedParams.length) {
            this.sendError({
                code: 503,
                message: this._createErrorMessage(undefinedParams),
            });
            return;
        }

        Storage.readFromCache({ start: Number(params.start), end: Number(params.end) })
            .then((response) => {
                this.sendJson(response);
            })
            .catch(error => {
                this.sendError({
                    code: 503,
                    message: error.message,
                });
            })

    }
}

