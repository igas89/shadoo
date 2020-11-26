import BaseHandler from '../../BaseHandler';

export default class PostsHandler extends BaseHandler {
    done() {
        this.sendJson('PostsHandler dada');
    }
}

