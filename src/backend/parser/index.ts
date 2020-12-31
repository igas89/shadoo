/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import cheerio from 'cheerio';

import {
    StorageResponse,
    StorageResponseTags,
    StorageResponseComments,
    StorageResponseCommentsChildren,
} from 'types/storage';
import { dateISOtoTime } from '../../utils/Dates';
import TaskManager from '../taskManager';

const parseImageName = (urlImage: string): string | undefined => {
    const m = urlImage.match(/[0-9a-z_]+\.[a-z]+$/i) || [];
    return m.length ? m[0] : undefined;
};

async function downloadImage(urlImage: string): Promise<unknown> {
    const dirUpload = path.resolve(__dirname, '../../../upload');
    const fileName = parseImageName(urlImage);

    if (!fileName) {
        return Promise.reject('Ошибка в названии картинки');
    }

    const filePath = path.resolve(dirUpload, fileName);

    if (!fs.existsSync(dirUpload)) {
        fs.mkdirSync(dirUpload);
    }

    const writer = fs.createWriteStream(filePath);
    const response = await axios({
        url: urlImage,
        method: 'GET',
        responseType: 'stream',
    });

    const logMessage = ` ---## Загружаем картинку: ${urlImage}\r`;
    // console.log(logMessage);
    process.stdout.write(logMessage);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

type PartialStorageResponse = Partial<StorageResponse>;
interface ParserProps {
    url: string;
    maxPage: number;
    requestLimit: number;
}

const parser = ({ url, maxPage, requestLimit }: ParserProps): Promise<StorageResponse[]> =>
    new Promise<StorageResponse[]>((res) => {
        const requests: Promise<StorageResponse[]>[] = [];

        const taskManager = new TaskManager({
            requestLimit,
            endQueue: () => {
                Promise.all(requests).then((response) => {
                    const data = response.reduce<StorageResponse[]>((acc, item) => acc.concat(item), []);
                    res(data);
                });
            },
        });

        for (let page = 1; page <= maxPage; page++) {
            taskManager.enqueue((taskId) => {
                const urlReq = `${url}?page=${page}`;
                const messageLog = ` --->> Читаем: ${urlReq}`;
                console.log(messageLog);
                // process.stdout.write(`${messageLog}\r`);

                const request = axios
                    .get(urlReq)
                    .then((response) => {
                        const res = new Promise<PartialStorageResponse[]>((resolve) => {
                            const requestsPost: Promise<PartialStorageResponse>[] = [];
                            const $ = cheerio.load(response.data, {
                                decodeEntities: false,
                            });

                            // Собираем полную статью
                            const getPost = (
                                url: string,
                                result: Partial<StorageResponse>,
                            ): Promise<Partial<StorageResponse>> =>
                                axios.get(url).then(({ data: html }) => {
                                    const $ = cheerio.load(html);
                                    const body = $.html($('.body'), {
                                        decodeEntities: false,
                                    })
                                        .trim()
                                        .replace(/(\r?\n|\r)/gm, '')
                                        .replace(/ {1,}/g, ' ');
                                    const $tagElements = $('.tags.entryMeta').find('a');

                                    const tags: StorageResponseTags[] = [];
                                    const comments: StorageResponseComments[] = [];

                                    if ($tagElements.length) {
                                        $tagElements.each((_idx, item) => {
                                            tags.push({
                                                url: $(item).attr('href') as string,
                                                title: $(item).text(),
                                            });
                                        });
                                    }

                                    $('.commentParentWrapper').each((idx, item) => {
                                        const $entryComment = $(item).find('> .entryComment');
                                        const avatar = $entryComment.find('img.userAvatar').attr('src') as string;
                                        const author = $entryComment.find('.commentAuthor').text();
                                        const date = $entryComment.find('.relativeDate').attr('datetime') as string;
                                        const content = $entryComment.find('.commentContent').text().trim();
                                        const commentId = $entryComment.attr('data-id') as string;
                                        const $commentsChildrenEl = $(item).find(
                                            '.commentsChildren ul.commentsList .commentItemWrapper',
                                        );
                                        const children: StorageResponseCommentsChildren[] = [];

                                        if ($commentsChildrenEl.length) {
                                            $commentsChildrenEl.each((id, item) => {
                                                const $child = $(item);
                                                const childId = $child.find('li.entryComment').attr('data-id') as string;
                                                const childAvatar = $child
                                                    .find('img.userAvatar')
                                                    .attr('src') as string;
                                                const childCommentAuthor = $child.find('.commentAuthor').text();
                                                const childRelativeDate = $child
                                                    .find('.relativeDate')
                                                    .attr('datetime') as string;
                                                const childCommentContent = ($child
                                                    .find('.commentContent')
                                                    .text() as string).split(',');
                                                const recipient = (childCommentContent.shift() as string).trim();

                                                children.push({
                                                    id: Number(childId),
                                                    avatar: childAvatar,
                                                    author: childCommentAuthor,
                                                    date: dateISOtoTime(childRelativeDate),
                                                    content: childCommentContent.join().trim(),
                                                    recipient,
                                                });
                                            });
                                        }

                                        comments.push({
                                            id: commentId,
                                            avatar,
                                            author,
                                            date: dateISOtoTime(date),
                                            content,
                                            children,
                                        });
                                    });

                                    const media = $.html($('.media')).trim();
                                    const image = $('.entryImageContainer img').attr('src') as string;
                                    result.content = body + media;
                                    result.image = image;
                                    result.tags = tags;
                                    result.comments = comments;
                                    return result;
                                });

                            $('.entryList > .entry').each((idx, elem) => {
                                const author = $(elem).find('.entryAuthor');
                                const avatar = author.find('img').attr('src') as string;
                                const title = $(elem).find('.entryTitle > a');
                                const url = title.attr('href') as string;
                                const date = $(elem).find('.entryDate').attr('datetime') || '';
                                const description = $(elem)
                                    .find('.entryContent')
                                    .text()
                                    .trim()
                                    .replace(/(\r)/gm, '')
                                    .replace(/ {1,}/g, ' ');
                                const image = $(elem).find('.entryImage img').attr('src') as string;
                                const commentsCount = Number($(elem).find('.entryComments').text());
                                const id = Number(url.replace(/.*\/\d{4}\/\d{2}\/\d{2}\/(\d+)\/.*/, '$1'));

                                const result: Partial<StorageResponse> = {
                                    id,
                                    page,
                                    date: dateISOtoTime(date),
                                    author: author
                                        .text()
                                        .replace(/[\n\s]/, '')
                                        .trim(),
                                    title: title.text(),
                                    content: '',
                                    description,
                                    descriptionImage: image,
                                    avatar,
                                    commentsCount,
                                    url: url.replace(/(^https?:\/\/.+\/\d{4}\/\d{2})\/\d{2}\/\d+\//, ''),
                                    // image: `uploads/${parseImageName(image)}`,
                                };

                                // downloadImage(image);
                                requestsPost.push(getPost(url, result));
                            });

                            Promise.all(requestsPost).then((posts) => {
                                taskManager.dequeue(taskId);
                                resolve(posts);
                            });
                        });

                        return res;
                    })
                    .catch((error) => {
                        console.log('\n --->> axios error: ', error);
                        Promise.reject(error);
                    });

                requests.push(request as Promise<StorageResponse[]>);
            });
        }

        taskManager.run();
    });

export default parser;