import BaseHandler from '../../BaseHandler';
import Storage from '../../../storage';
import { PostDataResponse } from 'types/handlers';

interface PostHandlerParams {
    id: string;
}

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
                let data: PostDataResponse[] = [];

                if (filter.length) {
                    data = filter.map((item) => ({
                        id: item.id,
                        url: item.url,
                        page: item.page,
                        avatar: item.avatar,
                        author: item.author,
                        date: item.date,
                        title: item.title,
                        content: item.content,
                        comments: item.comments,
                        commentsCount: item.commentsCount,
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

