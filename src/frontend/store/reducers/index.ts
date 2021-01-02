import { authReducer } from './authReducer';
import { newsReducer } from './newsReducer';
import { postReducer } from './postReducer';
import { updateNewsReducer } from './updateNewsReducer';
import { lastCommentsReducer } from './lastCommentsReducer';

export default {
    authState: authReducer,
    newsState: newsReducer,
    postState: postReducer,
    updateNewsState: updateNewsReducer,
    lastCommentsState: lastCommentsReducer,
};
