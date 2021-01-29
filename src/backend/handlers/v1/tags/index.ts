import BaseHandler from '../../BaseHandler';
import TagsModels from '../../../models/tags.models';

export default class TagsHandler extends BaseHandler {
    done(): void {
        TagsModels.getAllTags()
            .then((data) => {
                this.sendJson({ data });
            }).catch(err => {
                this.sendError({
                    status: 503,
                    code: 503,
                    message: err,
                });
            });
    }
}
