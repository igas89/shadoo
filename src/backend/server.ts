import path from 'path';
import Application from './app';
import { getHandlersList } from './helpers/cfg';

const SERVER_PORT = 3000;
const dist = path.join(__dirname, '/../../dist/');

Application
    .setStatic(dist)
    .setRoutes(getHandlersList())
    .startServer(SERVER_PORT, (port) => {
        console.log(`Server started on port http://localhost:${port}/`);
    });

process.on('uncaughtException', (err) => {
    console.log("\n --->> uncaughtException\n", err);
    process.exit(0);
});

process.on('unhandledRejection', (reason, p) => {
    console.log("\n --->> Unhandled Rejection at: Promise\n", { p, reason: reason });
});
