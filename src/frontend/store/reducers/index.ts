import { newsReducer } from './newsReducer';
import { postReducer } from './postReducer';
import { updateNewsReducer } from './updateNewsReducer';

export default {
    newsState: newsReducer,
    postState: postReducer,
    updateNewsState: updateNewsReducer,
}