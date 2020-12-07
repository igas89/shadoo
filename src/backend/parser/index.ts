import fs from 'fs';
import path from 'path';
import axios from 'axios';
import cheerio from 'cheerio';

import TaskManager from '../taskManager';
import storage from '../storage';

import { Cfg } from '../helpers/cfg';
const { URL_PARSE } = Cfg('application');

const parseImageName = (urlImage: string): string | undefined => {
    const m = urlImage.match(/[0-9a-z\_]+\.[a-z]+$/i) || [];
    return m.length ? m[0] : undefined;
}

interface GetPost {
    author: string;
    avatar: string;
    id: number;
    url: string;
    image?: string;
    content?: string;
    title: string;
    description: string;
    descriptionImage: string;
    page: number;
    comments: number;
}

async function downloadImage(urlImage: string): Promise<any> {
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
    })
}

interface ParserProps {
    url: string;
    maxPage: number;
    requestLimit: number;
}

const Parser = ({ url, maxPage, requestLimit }: ParserProps): Promise<any> => new Promise((res, rej) => {
    const requests: Promise<any>[] = [];

    const taskManager = new TaskManager({
        requestLimit: requestLimit,
        endQueue: () => {
            res(requests)
        }
    });

    for (let page = 1; page <= maxPage; page++) {
        taskManager.enqueue((taskId) => {
            const urlReq = `${url}?page=${page}`;
            const messageLog = ` --->> Читаем: ${urlReq}`;
            console.log(messageLog);
            // process.stdout.write(`${messageLog}\r`);

            requests.push(axios.get(urlReq)
                .then(response => {
                    return new Promise((resolve, reject) => {
                        const requestsPost: Promise<any>[] = [];
                        const $ = cheerio.load(response.data, {
                            decodeEntities: false,
                        });

                        // const pages = $('.pagination li').not('.pageNext').last().text();
                        // console.log("\n --->> Всего страниц: \n", pages);

                        const getPost = (url: string, result: GetPost) => {
                            return axios.get(url)
                                .then(({ data: html }) => {
                                    const $ = cheerio.load(html);
                                    const body = $.html($('.body'), {
                                        decodeEntities: false
                                    }).trim().replace(/(\r?\n|\r)/gm, '').replace(/ {1,}/g, ' ');
                                    const media = $.html($('.media')).trim();
                                    const image = $('.entryImageContainer img').attr('src') as string;
                                    result.content = body+media;
                                    result.image = image;
                                    return result;
                                })
                        }

                        $('.entryList > .entry').each((idx, elem) => {
                            const author = $(elem).find('.entryAuthor');
                            const avatar = author.find('img').attr('src') as string;
                            const title = $(elem).find('.entryTitle > a');
                            const url = title.attr('href') as string;
                            const date = $(elem).find('.entryDate').attr('datetime')
                            const description = $(elem).find('.entryContent').text().trim().replace(/(\r)/gm, '').replace(/ {1,}/g, ' ');
                            const image = $(elem).find('.entryImage img').attr('src') as string;
                            const comments = Number($(elem).find('.entryComments').text());
                            const id = Number(url.replace(/.*\/\d{4}\/\d{2}\/\d{2}\/(\d+)\/.*/, '$1'));

                            // console.log('url:', url);
                            // const postId = idx + 1;
                            const result = {
                                id,
                                // id: page > 1 ? postId + page * 20 - 20 : postId,
                                page,
                                date,
                                author: author.text().replace(/[\n\s]/, '').trim(),
                                title: title.text(),
                                content: '',
                                description,
                                descriptionImage: image,
                                avatar,
                                comments,
                                url: url.replace(/(^https?:\/\/.+\/\d{4}\/\d{2})\/\d{2}\/\d+\//, ''),
                                // image: `uploads/${parseImageName(image)}`,
                            };

                            // downloadImage(image);
                            requestsPost.push(getPost(url, result))
                        });

                        Promise.all(requestsPost).then(posts => {
                            taskManager.dequeue(taskId);
                            resolve(posts)
                        })
                    });
                })
                .catch(error => {
                    console.log("\n --->> axios error: ", error);
                    Promise.reject(error);
                })
            )
        });
    }

    taskManager.run();
})

Parser({
    url: URL_PARSE,
    maxPage: 10,
    requestLimit: 10,
}).then((requests) => {
    Promise
        .all<Promise<any>[]>(requests)
        .then((response) => {
            const data = response.reduce<any[]>((acc, item) => {
                return acc.concat(item);
            }, [])
            // .sort((a, b) => a.id < b.id ? -1 : 1);

            storage.writeToCache(data);
        })
});
