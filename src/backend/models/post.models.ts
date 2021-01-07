import { RunResult } from 'sqlite3';
import { StorageResponse } from 'types/storage';
import { NewsDataResponse, PostDataResponse } from 'types/handlers';
import { PostItems, PostCount, PageCount } from 'types/db';

import Db from '../database';
import CommentsModels from './comments.models';

export type GetNews = Omit<PostItems, 'CONTENT' | 'IMAGE_URL'>;
export type GetNewsReturn = Omit<NewsDataResponse, 'comments'>;

export type GetPost = Omit<PostItems, 'DESCRIPTION' | 'DESCRIPTION_IMAGE'>;
export type GetPostReturn = Omit<PostDataResponse, 'comments' | 'tags'>;

export type SavePostProps = Omit<StorageResponse, 'tags' | 'comments' | 'commentsCount'>;

export default class PostModels {
    static async getPagesCount(offset: number |string): Promise<number> {
        const { PAGE_COUNT } = await Db.get<PageCount>('SELECT COUNT(P.POST_ID) / ? PAGE_COUNT FROM posts P', [offset]);
        return PAGE_COUNT;
    }

    static async getPostsCount(): Promise<number> {
        const { POST_COUNT } = await Db.get<PostCount>('SELECT COUNT(P.POST_ID) POST_COUNT FROM posts P');
        return POST_COUNT;
    }

    static async getNews(limit: string | number): Promise<GetNewsReturn[]> {
        const posts = await Db.all<GetNews[]>('SELECT \
                P.POST_ID, \
                P.URL, \
                P.AUTHOR, \
                P.AVATAR_URL, \
                P.DATE, \
                P.TITLE, \
                P.DESCRIPTION, \
                P.DESCRIPTION_IMAGE \
            FROM \
                posts P \
            ORDER BY P.DATE DESC \
            LIMIT ? \
        ', [limit]);

        return Promise.all<GetNewsReturn>(posts.map(async (post) => {
            const commentsCount = await CommentsModels.getCommentsCount(post.POST_ID);

            return {
                author: post.AUTHOR,
                avatar: post.AVATAR_URL,
                commentsCount,
                date: post.DATE,
                description: post.DESCRIPTION,
                descriptionImage: post.DESCRIPTION_IMAGE,
                id: post.POST_ID,
                title: post.TITLE,
                url: post.URL,
            };
        }));
    }

    static async getPost(postId: number | string): Promise<GetPostReturn[]> {
        const posts = await Db.all<GetPost[]>('SELECT \
                P.POST_ID, \
                P.URL, \
                P.AUTHOR, \
                P.AVATAR_URL, \
                P.DATE, \
                P.TITLE, \
                P.CONTENT, \
                P.IMAGE_URL \
            FROM \
                posts P \
            WHERE \
                P.POST_ID=?', [postId]);

        return Promise.all<GetPostReturn>(posts.map(async (post) => {
            const commentsCount = await CommentsModels.getCommentsCount(post.POST_ID);

            return {
                id: post.POST_ID,
                url: post.URL,
                author: post.AUTHOR,
                avatar: post.AVATAR_URL,
                date: post.DATE,
                commentsCount,
                title: post.TITLE,
                content: post.CONTENT,
                image: post.IMAGE_URL,
            };
        }));
    }

    static createPostTable(): Promise<RunResult> {
        return Db.run("CREATE TABLE IF NOT EXISTS `posts` (\
            `POST_ID` INTEGER NOT NULL UNIQUE,\
            `DATE` INTEGER NOT NULL, \
            `AUTHOR`TEXT NOT NULL, \
            `AVATAR_URL` TEXT DEFAULT NULL, \
            `TITLE` TEXT NOT NULL, \
            `CONTENT` TEXT NOT NULL, \
            `DESCRIPTION` TEXT NOT NULL, \
            `DESCRIPTION_IMAGE` TEXT NOT NULL, \
            `URL` TEXT NOT NULL DEFAULT '', \
            `IMAGE_URL` TEXT DEFAULT NULL \
        )");
    }

    static savePost(post: SavePostProps): Promise<RunResult> {
        return Db.run('INSERT OR IGNORE INTO posts (\
                POST_ID,\
                DATE, \
                AUTHOR, \
                AVATAR_URL, \
                TITLE, \
                CONTENT,\
                DESCRIPTION, \
                DESCRIPTION_IMAGE, \
                URL,\
                IMAGE_URL) \
            VALUES (\
                $postId, \
                $date, \
                $author, \
                $avatar, \
                $title, \
                $content, \
                $description, \
                $descriptionImage, \
                $url, \
                $imageUrl)', {
            $postId: post.id,
            $date: post.date,
            $author: post.author,
            $avatar: post.avatar,
            $title: post.title,
            $content: post.content,
            $description: post.description,
            $descriptionImage: post.descriptionImage,
            $url: post.url,
            $imageUrl: post.image,
        });
    }
}