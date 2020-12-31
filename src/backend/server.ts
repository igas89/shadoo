/* eslint-disable no-console */
import path from 'path';
import Application from './app';

import { color } from './helpers/common';
import { getHandlersList } from './helpers/cfg';
import { SERVER_PORT, OUTPUT_DIR } from './config/application';

import PostModels from './models/post.models';
import CommentsModels from './models/comments.models';

const dist = path.join(__dirname, `/../../${OUTPUT_DIR}/`);

Application.setStatic(dist)
    .setRoutes(getHandlersList())
    .startServer(SERVER_PORT, (port) => {
        console.log(`\n${color.green}# ${color.white}Server started on port ${color.yellow}http://localhost:${port}/${color.white}`);

        PostModels.createPostTable().then(res => {
            console.log(`${color.green}# ${color.white}CREATE TABLE ${color.yellow}posts${color.white}`);
        }).catch(err => {
            console.error(`${color.red}# ${color.white}CREATE TABLE ${color.yellow}posts${color.white}: error`, err.message);
        });

        CommentsModels.createCommentsTable().then(res => {
            console.log(`${color.green}# ${color.white}CREATE TABLE ${color.yellow}comments${color.white}`);
        }).catch(err => {
            console.error(`${color.red}# ${color.white}CREATE TABLE ${color.yellow}comments${color.white}: error`, err.message);
        });
    });

process.on('uncaughtException', (err) => {
    console.error('\n --->> uncaughtException\n', err);
    process.exit(0);
});

process.on('unhandledRejection', (reason, p) => {
    console.error('\n --->> Unhandled Rejection at: Promise\n', {
        p,
        reason,
    });
});
