import { PostDataResponse } from 'types/handlers';
import BaseHandler from '../../BaseHandler';
import Storage from '../../../storage';

interface PostHandlerParams {
    id: string;
}

export default class PostHandler extends BaseHandler<PostHandlerParams> {
    done<T extends PostHandlerParams>(params: T): void {
        if (!params.id) {
            this.sendError({
                status: 503,
                code: 503,
                message: 'Не передан обязательный параметр id',
            });
            return;
        }

        Storage.readFromCache()
            .then((response) => {
                const filter = response.data.filter((item) => item.id === Number(params.id));
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
                        tags: item.tags,
                        content: item.content,
                        comments: item.comments,
                        commentsCount: item.commentsCount,
                        image: item.image,
                    }));
                }
                this.sendJson({ data });
            })
            .catch((error) => {
                this.sendError({
                    status: error.code,
                    code: error.code,
                    message: error.message,
                });
            });
    }
}
