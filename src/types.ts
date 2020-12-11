
export interface StorageResponseCommentsChildren extends Omit<StorageResponseComments, 'children'> {
    recipient: string;
};

export interface StorageResponseComments {
    avatar: string;
    author: string;
    date: string;
    content: string;
    children: StorageResponseCommentsChildren[]
};

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
    comments: StorageResponseComments[];
    commentsCount: number;
    url: string;
    image: string;
}