import BaseHandler from '../../BaseHandler';
import Storage from '../../../storage';

interface PostHandlerParams {
    id: string;
}

export default class PostHandler extends BaseHandler {
    done(params: PostHandlerParams) {
        if (!params.id) {
            this.sendError({
                code: 503,
                message: 'Не передан обязательный параметр id',
            });
            return;
        }

        Storage.readFromCache()
            .then((response) => {
                let filter = response.data.filter((item: any) => item.id === Number(params.id));

                if (filter.length) {
                    filter = filter.map((item: any) => ({
                        id: item.id,
                        url: item.url,
                        avatar: item.avatar,
                        author: item.author,
                        date: item.date,
                        title: item.title,
                        content: item.content,
                        image: item.image,
                    }))
                }
                this.sendJson({ data: filter });
            })
            .catch(error => {
                this.sendError({
                    code: error.code || 503,
                    message: error.message,
                });
            })

    }
}

