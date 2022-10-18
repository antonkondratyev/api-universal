import { Dialect, PoolOptions } from 'sequelize';

export default class DatabaseOptions {
    connectionString: string;
    dialect: Dialect;
    logging: boolean;
    pool: PoolOptions;
}
