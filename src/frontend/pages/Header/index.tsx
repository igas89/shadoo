import React, { FC, memo } from 'react';
import { Link } from 'react-router-dom';
import './Header.scss';

const Header: FC = memo(() => {
    return (
        <div className='header'>
            <div className='header__wrap'>
                <Link to='/'>
                    <img className='header__logo' src='/icons/logo.svg' />
                </Link>
                <div className='header__title'>
                    <span>Shadoo</span>
                    <span>React TypeScript</span>
                </div>
            </div>
        </div>
    )
});

export default Header;