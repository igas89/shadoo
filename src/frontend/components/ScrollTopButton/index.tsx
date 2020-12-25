import React, { FC, memo, useCallback, useEffect, useState, useRef } from 'react';
import { animateScroll as scroll } from 'react-scroll';

import './ScrollTopButton.scss';

const ScrollTopButton: FC = memo(() => {
    const [hidden, setHidden] = useState(true);
    const [isScrolling, setScrolling] = useState(false);
    const scrollRef = useRef<number | null>(null);

    const scrollToTop = useCallback(() => {
        setHidden(true);
        setScrolling(true);
        scroll.scrollToTop();
    }, []);

    const handleScroll = useCallback(() => {
        if (scrollRef.current) {
            clearTimeout(scrollRef.current);
        }

        scrollRef.current = window.setTimeout(() => {
            const position = window.pageYOffset;
            const isHidden = position <= 1500;

            if (position === 0) {
                setScrolling(false);
            }

            if (!isScrolling) {
                setHidden(isHidden);
            }
        }, 100);
    }, [isScrolling, scrollRef]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    return (
        <div className={`scroll-top ${hidden ? 'scroll-top_hidden' : ''}`}>
            <button type='button' className='scroll-top__btn' onClick={scrollToTop} aria-label='scrollTop' />
        </div>
    );
});

export default ScrollTopButton;
