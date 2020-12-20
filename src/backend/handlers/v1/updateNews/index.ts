import BaseHandler from '../../BaseHandler';
import storage from '../../../storage';
import parser from '../../../parser';
import { URL_PARSE } from '../../../config/application';

export default class UpdateNewsHandler extends BaseHandler {
    done(): void {
        parser({
            url: URL_PARSE,
            maxPage: 10,
            requestLimit: 10,
        }).then((response) => {
            storage.writeToCache(response).then((storageResponse) => {
                this.sendJson({
                    data: storageResponse,
                });
            });
        });
    }
}
