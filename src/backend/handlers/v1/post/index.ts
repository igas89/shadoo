import BaseHandler from '../../BaseHandler';
import Storage from '../../../storage';
import { StorageResponse } from 'types';

interface PostHandlerParams {
    id: string;
}

type Data = Omit<StorageResponse, 'description' | 'descriptionImage' | 'page' | 'comments'| 'commentsCount'>[];

export default class PostHandler extends BaseHandler<PostHandlerParams> {
    done<T extends PostHandlerParams>(params: T) {
        if (!params.id) {
            this.sendError({
                code: 503,
                message: 'Не передан обязательный параметр id',
            });
            return;
        }

        Storage.readFromCache()
            .then((response) => {
                const filter = response.data.filter((item) => item.id === Number(params.id))
                let data: Data = [];

                if (filter.length) {
                    data = filter.map((item) => ({
                        id: item.id,
                        url: item.url,
                        avatar: item.avatar,
                        author: item.author,
                        date: item.date,
                        title: item.title,
                        content: item.content,
                        image: item.image,
                    }));
                }
                this.sendJson({ data });
            })
            .catch(error => {
                this.sendError({
                    code: error.code || 503,
                    message: error.message,
                });
            })

    }
}

