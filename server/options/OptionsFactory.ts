import * as express from 'express';
import * as cors from 'cors';
import * as config from '../config';
import AppOptions from './AppOptions';
import ServerOptions from './ServerOptions';
import DatabaseOptions from './DatabaseOptions';
import AuthController from '../controllers/AuthController';
import UserController from '../controllers/UserController';
import RoleController from '../controllers/RoleController';
import UserRolesController from '../controllers/UserRolesController';

export default class OptionsFactory {
    public create(): AppOptions {
        /*
         * Server Options
         */
        let serverOptions: ServerOptions = new ServerOptions();
        serverOptions.port = config.SERVER_PORT;
        serverOptions.controllers = [
            new AuthController(),
            new UserController(),
            new RoleController(),
            new UserRolesController(),
        ];
        serverOptions.middlewares = [
            cors({ credentials: true, origin: true }),
            express.json(),
        ];

        /*
         * Database Options
         */
        let databaseOptions: DatabaseOptions = new DatabaseOptions();
        databaseOptions.connectionString = config.DATABASE_URL;
        databaseOptions.dialect = config.DATABASE_DIALECT;
        databaseOptions.logging = config.DATABASE_LOGGING;
        databaseOptions.pool = { idle: 10000 };

        /*
         * App Options
         */
        let appOptions: AppOptions = new AppOptions();
        appOptions.server = serverOptions;
        appOptions.database = databaseOptions;

        return appOptions;
    }
}
