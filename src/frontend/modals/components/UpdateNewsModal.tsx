import React, { FC } from 'react';
import styled from 'styled-components/macro';
import Modal from 'components/Modal';
import { StorageResponseUpdateNews } from 'types/storage';
import { pluralize } from 'utils/String';

const Title = styled.div`
    font-size: 17px;
    font-weight: bold;
    font-family: "Montserrat", "Trebuchet MS", Helvetica, "Helvetica Neue", Arial, sans-serif;
`;

const List = styled.ul`
    list-style: none;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ffffff14;
    border-radius: 4px;
    background-color: #3d3e4180;
`;

interface LiProps {
    className?: string;
    title: string;
}

const Li: FC<LiProps> = ({ className, title, children }) => (
    <li className={className}>{title}: <span>{children}</span></li>
);

const Time = styled.div`
    font-style: italic;
    font-size: 15px;
    color: #ffffff66;
`;

const Item = styled(Li) <LiProps>`
    line-height: 1.6em;
    & > span {
        font-size: 15px;
        font-weight: bold;
    }
`;

export interface UpdateNewsModalProps {
    data: StorageResponseUpdateNews;
}

const UpdateNewsModal: FC<UpdateNewsModalProps> = ({ data }) => (
    <Modal title='Новости успешно обновлены'>
        <Title>Записано в базу данных:</Title>
        <List>
            <Item title='Новых постов'>{data.postCount}</Item>
            <Item title='Новых коментариев'>{data.commentsCount}</Item>
        </List>
        <Time>Обновлено за <span>{data.time}</span> {pluralize(data.time, 'секунд', ['', 'ы', ''])}</Time>
    </Modal>
);

export default UpdateNewsModal;