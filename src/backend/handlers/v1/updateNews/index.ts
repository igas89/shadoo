import BaseHandler from '../../BaseHandler';
import storage from '../../../storage';
import { StorageResponse } from 'types/storage';

import { Cfg } from '../../../helpers/cfg';
const { URL_PARSE } = Cfg('application');

import parser from '../../../parser';

export default class UpdateNewsHandler extends BaseHandler {
    done() {
        parser({
            url: URL_PARSE,
            maxPage: 10,
            requestLimit: 10,
        }).then((requests) => {
            Promise.all<StorageResponse[]>(requests).then((response) => {
                const data = response.reduce<StorageResponse[]>((acc, item) => {
                    return acc.concat(item);
                }, []);

                storage.writeToCache(data).then((storageResponse) => {
                    this.sendJson({
                        data: storageResponse,
                    });
                });
            });
        });
    }
}
