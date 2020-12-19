import { authReducer } from './authReducer';
import { newsReducer } from './newsReducer';
import { postReducer } from './postReducer';
import { updateNewsReducer } from './updateNewsReducer';

export default {
    authState: authReducer,
    newsState: newsReducer,
    postState: postReducer,
    updateNewsState: updateNewsReducer,
};
