import { RunResult } from 'sqlite3';
import { NewsDataResponse, PostDataResponse } from 'types/handlers';
import { PostItems, PostCount, PageCount } from 'types/db';
import Db from '../database';

export type GetNews = Omit<PostItems, 'PAGE_ID' | 'CONTENT' | 'IMAGE_URL'>;
export type GetNewsReturn = Omit<NewsDataResponse, 'comments'>;

export type GetPost = Omit<PostItems, 'DESCRIPTION' | 'DESCRIPTION_IMAGE'>;
export type GetPostReturn = Omit<PostDataResponse, 'comments' | 'tags'>;

export interface SavePostProps {
    id: number;
    page: number;
    date: number;
    author: string;
    avatar: string;
    title: string;
    content: string;
    description: string;
    descriptionImage: string;
    commentsCount: number;
    url: string;
    image: string;
}

export default class PostModels {
    static async getPagesCount(): Promise<number> {
        const { PAGE_COUNT } = await Db.get<PageCount>('SELECT MAX(P.PAGE_ID) PAGE_COUNT FROM posts P');
        return PAGE_COUNT;
    }

    static async getPostsCount(): Promise<number> {
        const { POST_COUNT } = await Db.get<PostCount>('SELECT COUNT(ID) POST_COUNT FROM posts');
        return POST_COUNT;
    }

    static async getNews(start: string, end: string): Promise<GetNewsReturn[]> {
        const posts = await Db.all<GetNews[]>('SELECT \
                P.POST_ID, \
                P.URL, \
                P.AUTHOR, \
                P.AVATAR_URL, \
                P.DATE, \
                P.COMMENTS_COUNT, \
                P.TITLE, \
                P.DESCRIPTION, \
                P.DESCRIPTION_IMAGE \
            FROM \
                posts P \
            WHERE \
                P.ID BETWEEN ? AND ? \
            ORDER BY P.ID ASC', [start, end]);

        return posts.map<GetNewsReturn>((post) => ({
            author: post.AUTHOR,
            avatar: post.AVATAR_URL,
            commentsCount: post.COMMENTS_COUNT,
            date: post.DATE,
            description: post.DESCRIPTION,
            descriptionImage: post.DESCRIPTION_IMAGE,
            id: post.POST_ID,
            title: post.TITLE,
            url: post.URL,
        }));
    }

    static async getPost(postId: number | string): Promise<GetPostReturn[]> {
        const posts = await Db.all<GetPost[]>('SELECT \
                P.POST_ID, \
                P.PAGE_ID, \
                P.URL, \
                P.AUTHOR, \
                P.AVATAR_URL, \
                P.DATE, \
                P.COMMENTS_COUNT, \
                P.TITLE, \
                P.CONTENT, \
                P.IMAGE_URL \
            FROM \
                posts P \
            WHERE \
                P.POST_ID=?', [postId]);

        return posts.map<GetPostReturn>((post) => ({
            id: post.POST_ID,
            url: post.URL,
            page: post.PAGE_ID,
            author: post.AUTHOR,
            avatar: post.AVATAR_URL,
            date: post.DATE,
            commentsCount: post.COMMENTS_COUNT,
            title: post.TITLE,
            content: post.CONTENT,
            image: post.IMAGE_URL,
        }));
    }

    static createPostTable(): Promise<RunResult> {
        return Db.run("CREATE TABLE IF NOT EXISTS `posts` (\
            `ID` INTEGER PRIMARY KEY NOT NULL, \
            `POST_ID` INTEGER NOT NULL,\
            `PAGE_ID` INTEGER NOT NULL, \
            `DATE` INTEGER NOT NULL, \
            `AUTHOR`TEXT NOT NULL, \
            `AVATAR_URL` TEXT DEFAULT NULL, \
            `TITLE` TEXT NOT NULL, \
            `CONTENT` TEXT NOT NULL, \
            `DESCRIPTION` TEXT NOT NULL, \
            `DESCRIPTION_IMAGE` TEXT NOT NULL, \
            `COMMENTS_COUNT` INTEGER NOT NULL DEFAULT 0, \
            `URL` TEXT NOT NULL DEFAULT '', \
            `IMAGE_URL` TEXT DEFAULT NULL \
        )");
    }

    static savePost(id: number, post: SavePostProps): Promise<RunResult> {
        return Db.run('REPLACE INTO posts (\
                ID, \
                POST_ID,\
                PAGE_ID,\
                DATE, \
                AUTHOR, \
                AVATAR_URL, \
                TITLE, \
                CONTENT,\
                DESCRIPTION, \
                DESCRIPTION_IMAGE, \
                COMMENTS_COUNT,\
                URL,\
                IMAGE_URL) \
            VALUES (\
                $id, \
                $postId, \
                $pageId, \
                $date, \
                $author, \
                $avatar, \
                $title, \
                $content, \
                $description, \
                $descriptionImage, \
                $commentsCount, \
                $url, \
                $imageUrl)', {
            $id: id,
            $postId: post.id,
            $pageId: post.page,
            $date: post.date,
            $author: post.author,
            $avatar: post.avatar,
            $title: post.title,
            $content: post.content,
            $description: post.description,
            $descriptionImage: post.descriptionImage,
            $commentsCount: post.commentsCount,
            $url: post.url,
            $imageUrl: post.image,
        });
    }
}