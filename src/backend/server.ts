import path from 'path';
import ServerApi from './serverApi';

const SERVER_PORT = 3000;
const dist = path.join(__dirname, '/../../dist/');

ServerApi
    .setStatic(dist)
    .start(SERVER_PORT);

ServerApi.App.all('*', (req, res, next) => {
    res.send('test')
    next();
});

process.on('uncaughtException', (err) => {
    console.log("\n --->> uncaughtException\n", err);
    process.exit(0);
});

// process.on('UnhandledPromiseRejectionWarning', (err: ) => {
//     console.log("\n --->> UnhandledPromiseRejectionWarning\n", err);
//     process.exit(0);
// });

process.on('unhandledRejection', (reason, p) => {
    console.log("\n --->> Unhandled Rejection at: Promise\n", { p, reason: reason });
});
