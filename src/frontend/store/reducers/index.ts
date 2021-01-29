import { authReducer } from './authReducer';
import { newsReducer } from './newsReducer';
import { postReducer } from './postReducer';
import { updateNewsReducer } from './updateNewsReducer';
import { lastCommentsReducer } from './lastCommentsReducer';
import { modalReducer } from './modalReducer';
import { breadcrumbsReducer } from './breadcrumbsReducer';
import { tagsReducer } from './tagsReducer';

export default {
    authState: authReducer,
    newsState: newsReducer,
    postState: postReducer,
    updateNewsState: updateNewsReducer,
    lastCommentsState: lastCommentsReducer,
    modalState: modalReducer,
    breadcrumbsState: breadcrumbsReducer,
    tagsState: tagsReducer,
};
