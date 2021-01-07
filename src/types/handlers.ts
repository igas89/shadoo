import { StorageResponse } from './storage';

export type NewsDataResponse = Omit<StorageResponse, 'content' | 'image' | 'tags'>;
export type PostDataResponse = Omit<StorageResponse, 'description' | 'descriptionImage'>;
