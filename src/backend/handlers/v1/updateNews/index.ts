import { Statement } from 'sqlite3';
import BaseHandler from '../../BaseHandler';
// import storage from '../../../storage';
import parser from '../../../parser';
import { PARSER_CONFIG } from '../../../config/application';

import Db from '../../../database';
import PostModels from '../../../models/post.models';
import CommentsModels from '../../../models/comments.models';

export default class UpdateNewsHandler extends BaseHandler {
    done(): void {
        const start = new Date().getTime();
        const request: Promise<Statement>[] = [];

        parser(PARSER_CONFIG).then((response) => {
            Db.instance.serialize(() => {
                Db.instance.run('BEGIN TRANSACTION');

                response.forEach((post, index) => {
                    const id = index + 1;

                    // Сохраняем список новостей
                    request.push(PostModels.savePost(id, post));

                    if (post.comments.length) {
                        post.comments.forEach((comment) => {
                            const parentIdid = comment.id;

                            // Сохраняем коментарии
                            request.push(CommentsModels.saveComments({
                                postId: post.id,
                                ...comment,
                            }));

                            if (comment.children && comment.children.length) {
                                comment.children.forEach((comment) => {
                                    // Сохраняем дочерние коментарии
                                    request.push(CommentsModels.saveComments({
                                        postId: post.id,
                                        parentId: parentIdid,
                                        ...comment,
                                    }));
                                });
                            }
                        });
                    }
                });

                Db.instance.run('COMMIT');
            });

            Promise.all(request)
                .then(result => {
                    const end = new Date().getTime();
                    const time = Math.floor((end - start) / 1000);

                    const message = `Записано в БД: ${response.length} постов за ${time} сек`;
                    // eslint-disable-next-line no-console
                    console.log(` --->> ${message}\n`);

                    this.sendJson({
                        data: {
                            status: 'ok',
                            message,
                        },
                    });
                })
                .catch(err => {
                    this.sendError({
                        status: 500,
                        code: 500,
                        message: 'Ошибка сохранения в БД',
                        data: err,
                    });
                });

            /* storage.writeToCache(response).then((storageResponse) => {
                this.sendJson({
                    data: storageResponse,
                });
            }); */
        });
    }
}
