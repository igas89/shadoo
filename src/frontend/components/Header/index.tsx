import React, { FC, memo } from 'react';
import { Link } from 'react-router-dom';

import ButtonUpdate from 'components/ButtonUpdate';
import ButtonUpdateInfo from 'components/ButtonUpdateInfo';
import './Header.scss';

const Header: FC = memo(() => (
    <div className='header'>
        <div className='header__wrap'>
            <Link to='/'>
                <img className='header__logo' src='/icons/logo.svg' alt='logo' />
            </Link>
            <div className='header__title'>
                <span>Shadoo</span>
                <span>React TypeScript</span>
            </div>

            <div className='header__update'>
                <ButtonUpdateInfo />
                <ButtonUpdate />
            </div>
        </div>
    </div>
));

export default Header;
