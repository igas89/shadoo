
import { RunResult } from 'sqlite3';

export type DbCallback = (this: RunResult, err: Error | null) => void;

export interface PostItems {
    POST_ID: number;
    DATE: number;
    AUTHOR: string;
    AVATAR_URL: string;
    TITLE: string;
    CONTENT: string;
    DESCRIPTION: string;
    DESCRIPTION_IMAGE: string;
    URL: string;
    IMAGE_URL: string;
    TAGS: string;
}

export interface PageCount {
    PAGE_COUNT: number;
}

export interface PostCount {
    POST_COUNT: number;
}

export interface CommentItems {
    ID: number;
    PARENT_ID: number;
    POST_ID: number;
    AUTHOR: string;
    AVATAR_URL: string;
    DATE: number;
    CONTENT: string;
    RECIPIENT: string;
}

export interface CommentsCount {
    COMMENTS_COUNT: number;
}

export interface TagsCount {
    TAGS_COUNT: number;
}

export interface LastComments extends Omit<CommentItems, 'PARENT_ID'> {
    TITLE: string;
    URL: string;
}

export interface TagsItem {
    ID: number | string;
    TITLE: string;
    DESCRIPTION: string;
}