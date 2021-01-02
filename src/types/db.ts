
import { RunResult } from 'sqlite3';

export type DbCallback = (this: RunResult, err: Error | null) => void;

export interface PostItems {
    POST_ID: number;
    PAGE_ID: number;
    DATE: number;
    AUTHOR: string;
    AVATAR_URL: string;
    TITLE: string;
    CONTENT: string;
    DESCRIPTION: string;
    DESCRIPTION_IMAGE: string;
    COMMENTS_COUNT: number;
    URL: string;
    IMAGE_URL: string;
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

export interface LastComments extends Omit<CommentItems, 'PARENT_ID'> {
    TITLE: string;
    URL: string;
}