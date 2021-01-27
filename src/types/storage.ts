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
    tagsCount: number;
    time: number;
    status: string;
}

export interface StorageResponseTags {
    id: number | string;
    title: string;
    description: string;
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
