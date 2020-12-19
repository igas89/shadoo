import React, { FC, memo } from 'react';

const PostEmpty: FC = memo(() => {
    return <div className='post-empty'>По вашему запросу ничего не найдено</div>;
});

export default PostEmpty;
