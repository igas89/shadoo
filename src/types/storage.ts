export interface StorageResponseCommentsChildren extends Omit<StorageResponseComments, 'children'> {
    recipient: string;
}

export interface StorageResponseComments {
    avatar: string;
    author: string;
    date: string;
    content: string;
    children: StorageResponseCommentsChildren[];
}

export interface StorageResponseTags {
    url: string;
    title: string;
}

export interface StorageResponse {
    id: number;
    page: number;
    date: string;
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
