import BaseHandler from '../../BaseHandler';
import CommentsModels from '../../../models/comments.models';

interface LastCommentsHandlerParams {
    limit: string;
}

export default class LastCommentsHandler extends BaseHandler<LastCommentsHandlerParams> {
    done<T extends LastCommentsHandlerParams>(params: T): void {
        if (!params.limit) {
            this.sendError({
                status: 503,
                code: 503,
                message: 'Не передан обязательный параметр limit',
            });
            return;
        }

        CommentsModels.getLastComments(params.limit)
            .then(async (data) => {
                const counts = await CommentsModels.getLastCommentsCount();
                this.sendJson({ counts, data });
            }).catch(err => {
                this.sendError({
                    status: 503,
                    code: 503,
                    message: err,
                });
            });
    }
}
