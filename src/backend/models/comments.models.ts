import { RunResult } from 'sqlite3';
import {
    StorageResponseComments,
    StorageResponseCommentsChildren,
    StorageResponseLastComments,
} from 'types/storage';
import { CommentItems, LastComments, LastCommentsCount, CommentsCount } from 'types/db';
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

    static async getLastComments(limit: number | string): Promise<StorageResponseLastComments[]> {
        const result = await Db.all<LastComments[]>('SELECT \
                C.*, \
                P.TITLE, \
                P.URL \
            FROM \
                comments C \
            INNER JOIN \
                posts P \
            ON C.POST_ID = P.POST_ID \
            ORDER BY \
                C.DATE \
            DESC LIMIT ?', [limit]);

        return result.map<StorageResponseLastComments>((item) => ({
            id: item.ID,
            author: item.AUTHOR,
            avatar: item.AVATAR_URL,
            date: item.DATE,
            title: item.TITLE,
            content: item.CONTENT,
            recipient: item.RECIPIENT,
            post_id: item.POST_ID,
            url: item.URL,
        }));
    }

    static async getLastCommentsCount(): Promise<number> {
        const { LAST_COMMENTS_COUNT } = await Db.get<LastCommentsCount>('SELECT COUNT(*) LAST_COMMENTS_COUNT FROM comments');
        return LAST_COMMENTS_COUNT;
    }

    static async getCommentsCount(postId: number): Promise<number> {
        const { COMMENTS_COUNT } = await Db.get<CommentsCount>('SELECT COUNT(ID) as COMMENTS_COUNT FROM comments WHERE POST_ID=?', [postId]);
        return COMMENTS_COUNT;
    }

    static createCommentsTable(): Promise<RunResult> {
        return Db.createTable('comments', '\
            `ID` INTEGER NOT NULL UNIQUE, \
            `PARENT_ID` INTEGER DEFAULT NULL, \
            `POST_ID` INTEGER NOT NULL, \
            `AUTHOR` TEXT NOT NULL, \
            `AVATAR_URL` TEXT DEFAULT NULL, \
            `DATE` INTEGER NOT NULL, \
            `CONTENT` TEXT NOT NULL DEFAULT "", \
            `RECIPIENT` TEXT DEFAULT NULL \
        ');
    }

    static saveComments(comment: SaveCommentsProps): Promise<RunResult> {
        return Db.run('INSERT OR IGNORE INTO comments (\
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
        });
    }
}