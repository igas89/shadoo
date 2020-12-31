export interface StorageResponseCommentsChildren extends Omit<StorageResponseComments, 'children'> {
    recipient?: string;
}

export interface StorageResponseComments {
    id: number | string;
    avatar: string;
    author: string;
    date: number;
    content: string;
    children?: StorageResponseCommentsChildren[];
}

export interface StorageResponseTags {
    url: string;
    title: string;
}

export interface StorageResponse {
    id: number;
    page: number;
    date: number;
    author: string;
    title: string;
    content: string;
    description: string;
    descriptionImage: string;
    avatar: string;
    tags: StorageResponseTags[];
    comments: StorageResponseComments[];
    commentsCount: number;
    url: string;
    image: string;
}
