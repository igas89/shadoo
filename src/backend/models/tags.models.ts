import { RunResult } from 'sqlite3';
import { TagsItem, TagsCount } from 'types/db';
import Db from '../database';

export interface SaveTagsProps {
    id: string | number;
    title: string;
    description: string;
}

export interface SavePostTagsProps {
    postId: string | number;
    tagsId: string | number;
}

export default class TagsModels {
    static async getPostTags(postId: number | string): Promise<SaveTagsProps[]> {
        const postTags = await Db.all<TagsItem[]>(`SELECT \
            T.ID, \
            T.TITLE, \
            T.DESCRIPTION \
        FROM 
            tags T \
        INNER JOIN 
            posts_tags PT \
        WHERE 
            PT.POST_ID=? AND T.ID=PT.TAGS_ID`, [postId]);

        return postTags.map<SaveTagsProps>(item => ({
            id: item.ID,
            title: item.TITLE,
            description: item.DESCRIPTION,
        }));
    }

    static async getAllTags(): Promise<SaveTagsProps[]> {
        const postTags = await Db.all<TagsItem[]>(`SELECT \
            T.ID, \
            T.TITLE, \
            T.DESCRIPTION \
        FROM 
            tags T \
        `);

        return postTags.map<SaveTagsProps>(item => ({
            id: item.ID,
            title: item.TITLE,
            description: item.DESCRIPTION,
        }));
    }

    static async getTagsCount(): Promise<number> {
        const { TAGS_COUNT } = await Db.get<TagsCount>('SELECT COUNT(*) TAGS_COUNT FROM tags');
        return TAGS_COUNT;
    }

    static createTagsTable(): Promise<RunResult> {
        return Db.createTable('tags', '\
            `ID` INTEGER PRIMARY KEY NOT NULL, \
            `TITLE` TEXT NOT NULL, \
            `DESCRIPTION` TEXT NOT NULL \
        ');
    }

    static createPostTagsTable(): Promise<RunResult> {
        return Db.createTable('posts_tags', '\
            `ID` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, \
            `POST_ID` INTEGER NOT NULL, \
            `TAGS_ID` INTEGER NOT NULL \
        ');
    }

    static saveTags(tag: SaveTagsProps): Promise<RunResult> {
        return Db.run('INSERT OR IGNORE INTO tags (\
                ID, \
                TITLE, \
                DESCRIPTION) \
            VALUES ( \
                $id, \
                $title, \
                $description)', {
            $id: tag.id,
            $title: tag.title,
            $description: tag.description,
        });
    }

    static savePostTags(post: SavePostTagsProps): Promise<RunResult> {
        return Db.run('INSERT OR REPLACE INTO posts_tags (\
                ID, \
                POST_ID,\
                TAGS_ID) \
            VALUES (\
                (SELECT \
                        ID \
                    FROM \
                        posts_tags \
                    WHERE \
                        POST_ID=$postId AND TAGS_ID=$tagsId \
                ), \
                $postId, \
                $tagsId \
            )', {
            $postId: post.postId,
            $tagsId: post.tagsId,
        });
    }
}