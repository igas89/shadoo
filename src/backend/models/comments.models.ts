/* eslint-disable no-console */
import { RunResult } from 'sqlite3';
import { StorageResponseComments, StorageResponseCommentsChildren } from 'types/storage';
import { CommentItems, DbCallback } from 'types/db';
import Db from '../database';

export interface SaveCommentsProps extends StorageResponseCommentsChildren {
    postId: string | number;
    parentId?: string | number;
    childrenId?: string | number;
}

export default class CommentsModels {
    static async getPostComments(postId: number | string): Promise<StorageResponseComments[]> {
        const postComments = await Db.all<CommentItems[]>('SELECT \
                C.ID, \
                C.PARENT_ID, \
                C.POST_ID, \
                C.AUTHOR, \
                C.AVATAR_URL, \
                C.DATE, \
                C.CONTENT, \
                C.RECIPIENT \
            FROM \
                comments C \
            WHERE \
                C.POST_ID=?', [postId]);

        return postComments.filter(item => !item.PARENT_ID)
            .map<StorageResponseComments>(item => {
                const filter = postComments.filter(i => item.ID === i.PARENT_ID);

                const children = filter.length
                    ? filter.map<StorageResponseCommentsChildren>(item => ({
                        id: item.ID,
                        avatar: item.AVATAR_URL,
                        author: item.AUTHOR,
                        date: item.DATE,
                        content: item.CONTENT,
                        recipient: item.RECIPIENT,
                    }))
                    : [];

                return {
                    id: item.ID,
                    avatar: item.AVATAR_URL,
                    author: item.AUTHOR,
                    date: item.DATE,
                    content: item.CONTENT,
                    children,
                };
            });
    }

    static createCommentsTable(): Promise<RunResult> {
        return Db.run("CREATE TABLE IF NOT EXISTS `comments` (\
            `ID` INTEGER PRIMARY KEY NOT NULL, \
            `PARENT_ID` INTEGER DEFAULT NULL, \
            `POST_ID` INTEGER NOT NULL, \
            `AUTHOR` TEXT NOT NULL, \
            `AVATAR_URL` TEXT DEFAULT NULL, \
            `DATE` INTEGER UNIQUE NOT NULL, \
            `CONTENT` TEXT NOT NULL DEFAULT '', \
            `RECIPIENT` TEXT DEFAULT NULL \
        )");
    }

    static saveComments(comment: SaveCommentsProps, callback?: DbCallback): Promise<RunResult> {
        return Db.run('REPLACE INTO comments (\
                ID, \
                PARENT_ID, \
                POST_ID, \
                AUTHOR, \
                AVATAR_URL, \
                DATE, \
                CONTENT, \
                RECIPIENT) \
            VALUES ( \
                $id, \
                $parentId, \
                $postId, \
                $author, \
                $avatar, \
                $date, \
                $content, \
                $recipient)', {
            $id: comment.id,
            $parentId: comment.parentId || null,
            $postId: comment.postId,
            $author: comment.author,
            $avatar: comment.avatar,
            $date: comment.date,
            $content: comment.content,
            $recipient: comment.recipient || null,
        }, callback);
    }
}