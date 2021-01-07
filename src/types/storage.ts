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

export interface StorageResponseLastComments extends StorageResponseCommentsChildren {
    title: string;
    post_id: number;
    url: string;
}

export interface StorageResponseUpdateNews {
    commentsCount: number;
    postCount: number;
    time: number;
    status: string;
}

export interface StorageResponseTags {
    url: string;
    title: string;
}

export interface StorageResponse {
    id: number;
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
