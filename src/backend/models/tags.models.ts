/* eslint-disable no-console */
import { RunResult } from 'sqlite3';
import { StorageResponseComments, StorageResponseCommentsChildren } from 'types/storage';
import { CommentItems } from 'types/db';
import Db from '../database';

interface SaveCommentsProps {
    id?: number;
    parentId?: number | null;
    childrenId?: number | null;
    postId: number;
    author: string;
    avatar: string;
    date: number;
    content: string;
    recipient?: string | null;
}

export default class TagsModels {
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

    static saveComments(comment: SaveCommentsProps): void {
        // CHILDREN_ID, \
        Db.instance.run('REPLACE INTO comments (\
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
            // $childrenId: comment.childrenId || null,
            $postId: comment.postId,
            $author: comment.author,
            $avatar: comment.avatar,
            $date: comment.date,
            $content: comment.content,
            $recipient: comment.recipient || null,
        }, (err) => {
            if (err) {
                console.error('REPLACE INTO comments:', err.message);
            }
        });
    }
}