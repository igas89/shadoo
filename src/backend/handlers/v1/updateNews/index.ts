/* eslint-disable class-methods-use-this */
import BaseHandler from '../../BaseHandler';
// import storage from '../../../storage';
import parser from '../../../parser';
import { PARSER_CONFIG } from '../../../config/application';

import Db from '../../../database';
import PostModels, { SavePostProps } from '../../../models/post.models';
import CommentsModels, { SaveCommentsProps } from '../../../models/comments.models';
import TagsModels, { SaveTagsProps, SavePostTagsProps } from '../../../models/tags.models';

import App from '../../../app';
import { getToken } from '../../../helpers/validateToken';
import { WS_UPDATE_NEWS } from '../../../../ws/constants';

interface ResultSaving {
    post?: number;
    comment?: number;
    tag?: number;
    post_tag?: number;
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

    private saveTags(tag: SaveTagsProps): Promise<Pick<ResultSaving, 'tag'>> {
        return TagsModels.saveTags({
            id: tag.id,
            title: tag.title,
            description: tag.description,
        }).then(result => Promise.resolve({
            tag: result.changes,
        }));
    }

    private savePostTags(props: SavePostTagsProps): Promise<Pick<ResultSaving, 'post_tag'>> {
        return TagsModels.savePostTags({
            postId: props.postId,
            tagsId: props.tagsId,
        }).then(result => Promise.resolve({
            post_tag: result.changes,
        }));
    }

    done(): void {
        const start = new Date().getTime();
        const result: Promise<ResultSaving>[] = [];
        const socket = App.wss.getClientSocket(getToken(this.request) as string);
        const { maxPage, requestLimit } = PARSER_CONFIG;

        const postHandle = (index: number): void => {
            if (!socket) {
                return;
            }

            const percent = Math.floor(index / (maxPage * requestLimit) * 100);
            socket.emitEvent(WS_UPDATE_NEWS, { percent });
        };

        parser({
            ...PARSER_CONFIG,
            postHandle,
        }).then((response) => {
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

                    if (post.tags.length) {
                        post.tags.forEach((tag) => {
                            // Сохраняем список тэгов
                            result.push(this.saveTags({
                                id: tag.id,
                                title: tag.title,
                                description: tag.description,
                            }));

                            // Сохраняем теги поста
                            result.push(this.savePostTags({
                                postId: post.id,
                                tagsId: tag.id,
                            }));
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
                    const tagsCount = result.filter(item => !!item.tag).length;
                    const message = `Записано в базу данных ${postCount} постов, за ${time} секунд`;

                    // eslint-disable-next-line no-console
                    console.log(` --->> ${message}\n`);

                    this.sendJson({
                        data: {
                            status: 'ok',
                            commentsCount,
                            postCount,
                            tagsCount,
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
