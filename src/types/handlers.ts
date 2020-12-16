import { StorageResponse } from './storage';

export type NewsDataResponse = Omit<StorageResponse, 'content' | 'page' | 'image'>;
export type PostDataResponse = Omit<StorageResponse, 'description' | 'descriptionImage'>;