/* eslint-disable class-methods-use-this */
import BaseHandler from '../../BaseHandler';
// import storage from '../../../storage';
import parser from '../../../parser';
import { PARSER_CONFIG } from '../../../config/application';

import Db from '../../../database';
import PostModels, { SavePostProps } from '../../../models/post.models';
import CommentsModels, { SaveCommentsProps } from '../../../models/comments.models';

interface ResultSaving {
    post?: number;
    comment?: number;
}
export default class UpdateNewsHandler extends BaseHandler {
    private savePost(post: SavePostProps): Promise<Pick<ResultSaving, 'post'>> {
        return PostModels.savePost(post).then(result => Promise.resolve({
            post: result.changes,
        }));
    }

    private saveComments(props: SaveCommentsProps): Promise<Pick<ResultSaving, 'comment'>> {
        return CommentsModels.saveComments(props).then(result => Promise.resolve({
            comment: result.changes,
        }));
    }

    done(): void {
        const start = new Date().getTime();
        const result: Promise<ResultSaving>[] = [];

        parser(PARSER_CONFIG).then((response) => {
            Db.instance.serialize(() => {
                Db.instance.run('BEGIN TRANSACTION');

                response.reverse().forEach((post) => {
                    // Сохраняем список новостей
                    result.push(this.savePost(post));

                    if (post.comments.length) {
                        post.comments.forEach((comment) => {
                            const parentIdid = comment.id;

                            // Сохраняем коментарии
                            result.push(this.saveComments({
                                postId: post.id,
                                ...comment,
                            }));

                            if (comment.children && comment.children.length) {
                                comment.children.forEach((comment) => {
                                    // Сохраняем дочерние коментарии
                                    result.push(this.saveComments({
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

            Promise.all(result)
                .then(async (result) => {
                    const end = new Date().getTime();
                    const time = Math.floor((end - start) / 1000);
                    const commentsCount = result.filter(item => !!item.comment).length;
                    const postCount = result.filter(item => !!item.post).length;
                    const message = `Записано в базу данных ${postCount} постов, за ${time} секунд`;

                    // eslint-disable-next-line no-console
                    console.log(` --->> ${message}\n`);

                    this.sendJson({
                        data: {
                            status: 'ok',
                            commentsCount,
                            postCount,
                            time,
                            result,
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
