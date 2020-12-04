import React, { FC, memo } from 'react';
import './Header.scss';

const Header: FC = memo(() => {
    return (
        <div className='header'>
            <div className='header__wrap'>
                <img className='header__logo' src='/icons/logo.svg' />
                <div className='header__title'>
                    <span>Shadoo</span>
                    <span>React TypeScript</span>
                </div>
            </div>
        </div>
    )
});

export default Header;