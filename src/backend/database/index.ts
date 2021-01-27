/* eslint-disable no-console */
import { verbose as sqliteDebug, Database, Statement, RunResult } from 'sqlite3';
import path from 'path';

import { DB_FILE, DB_DIR } from '../config/application';
import { color } from '../helpers/common';

const sqlite3 = sqliteDebug();

export type DbQueryCallback = (this: Statement, err: Error | null, rows: unknown[]) => void;

class Db {
    private db: Database;

    constructor() {
        const pathDbFile = path.join(DB_DIR, `/${DB_FILE}`);

        this.db = new sqlite3.Database(pathDbFile, (err): void => {
            if (err) {
                console.error(err.message);
                return;
            }

            console.log(`\n${color.green}# ${color.white}Connected to the ${color.yellow}${pathDbFile}${color.white} SQlite database.`);
        });
    }

    public initial(callback: (db?: Database) => void): void {
        callback.call(this, this.db);
    }

    get instance(): Database {
        return this.db;
    }

    public close(): Promise<string> {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) {
                    reject(err.message);
                    return;
                }

                resolve('Close the database connection.');
            });
        });
    }

    public all<T>(sql: string, ...params: unknown[]): Promise<T> {
        return new Promise((resolve, reject) => {
            this.db.all(sql, ...params, (err: Error, rows: T): void => {
                if (err) {
                    reject(err.message);
                    return;
                }

                resolve(rows);
            });
        });
    }

    public get<T>(sql: string, ...params: unknown[]): Promise<T> {
        return new Promise((resolve, reject) => {
            this.db.get(sql, ...params, (err: Error, rows: T): void => {
                if (err) {
                    reject(err.message);
                    return;
                }

                resolve(rows);
            });
        });
    }

    public prepare(sql: string, ...params: unknown[]): Promise<Statement> {
        return new Promise((resolve, reject) => {
            this.db.prepare(sql, ...params, function (this: Statement, err: Error | null) {
                if (err) {
                    reject(err.message);
                    return;
                }

                resolve(this);
            });
        });
    }

    public run(sql: string, ...params: unknown[]): Promise<RunResult> {
        return new Promise((resolve, reject) => {
            this.db.run(sql, ...params, function (this: RunResult, err: Error | null) {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(this);
            });
        });
    }

    public createTable(table: string, sql: string): Promise<RunResult> {
        return this.run(`CREATE TABLE IF NOT EXISTS '${table}' (${sql})`)
            .then(result => {
                console.log(`${color.green}# ${color.white}CREATE TABLE ${color.yellow}${table}${color.white}`);
                return Promise.resolve(result);
            })
            .catch(err => {
                console.error(`${color.red}# ${color.white}CREATE TABLE ${color.yellow}${table}${color.white}: error`, err.message);
                return Promise.reject(err);
            });
    }
}

export default new Db();