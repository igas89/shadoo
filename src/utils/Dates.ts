export const dateISOtoString = (date: string): string => date.replace(/(\d{4})-(\d{2})-(\d{2}).*/, '$3.$2.$1');
export const dateISOtoTime = (date: string): number => new Date(date).getTime();

export const humanizeDateISO = (dateISO: string | number): string => {
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
    const date = new Date(dateISO);

    const formatDate = (date: string | number): string => `0${date}`.slice(-2);
    const hours = formatDate(date.getHours());
    const minutes = formatDate(date.getMinutes());

    return `${date.getDate()} ${MONTHS_LIST[date.getMonth()]} ${date.getFullYear()} ${hours}:${minutes}`;
};