import { pluralize } from './String';

export const dateISOtoString = (date: string): string => date.replace(/(\d{4})-(\d{2})-(\d{2}).*/, '$3.$2.$1');
export const dateISOtoTime = (date: string): number => new Date(date).getTime();

export const humanizeDate = (entryDate: string | number, convertTime = true): string => {
    const MONTHS_LIST = [
        'января',
        'февраля',
        'марта',
        'апреля',
        'мая',
        'июня',
        'июля',
        'августа',
        'сентября',
        'октября',
        'ноября',
        'декабря',
    ];

    const date = new Date(entryDate);
    let newDate = '';

    let hours: string | number = '';
    let minutes: string | number = '';

    if (convertTime) {
        const currentDate = new Date();
        minutes = Math.floor((currentDate.getTime() - date.getTime()) / (1000 * 60));
        newDate = minutes < 1
            ? 'менее минуты назад'
            : `${minutes} ${pluralize(minutes, 'минут', ['', 'ы', ''])} назад`;
    }

    if (!convertTime || (convertTime && minutes > 60)) {
        const formatDate = (date: string | number): string => `0${date}`.slice(-2);
        hours = formatDate(date.getHours());
        minutes = formatDate(date.getMinutes());

        newDate = `${date.getDate()} ${MONTHS_LIST[date.getMonth()]} ${date.getFullYear()} ${hours}:${minutes}`;
    }

    return newDate;
};
