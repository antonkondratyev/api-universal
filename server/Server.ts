import * as http from 'http';
import * as express from 'express';
import AppOptions from './options/AppOptions';
import ServerOptions from './options/ServerOptions';
import DatabaseOptions from './options/DatabaseOptions';
import Database from './database/Database';
import Controller from './Controller';

export default class Server {
    private _app: express.Application = express();
    private _port: number;
    private _controllers: Controller[];
    private _middlewares: express.RequestHandler[];
    private _database: Database;
    
    constructor(options: ServerOptions) {
        this._port = options.port;
        this._controllers = options.controllers;
        this._middlewares = options.middlewares;
    }

    public async initDatabase(options: DatabaseOptions): Promise<void> {
        this._database = new Database(options);
        await this._database.auth();
        await this._database.sync();
    }

    public loadGlobalSettings(options: AppOptions): void {
        this._app.set('database', options.database);
        this._app.set('credentials', options.credentials);
    }

    public loadMiddlewares(): void {
        this._middlewares.forEach(middleware => this._app.use(middleware));
    }

    public loadControllers(): void {
        this._controllers.forEach(controller => this._app.use(controller.path, controller.setRoutes()));
    }

    public run(): http.Server {
        return this._app.listen(this._port, () => {
            console.log(`The server is running on port: ${this._port}`);
        });
    }
}
