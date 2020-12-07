import React, { useCallback } from 'react';

export interface UseTitle {
    setTitle(title: string): void;
    getTitle(): string
}

const useTitle = (): UseTitle => {
    const setTitle = useCallback((title: string): void => {
        document.title = title;
    }, []);

    const getTitle = useCallback((): string => {
        return document.title;
    }, [document.title]);


    return {
        setTitle,
        getTitle,
    }
}

export default useTitle;