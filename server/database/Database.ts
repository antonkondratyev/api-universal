import { Sequelize, Model } from 'sequelize';
import DatabaseOptions from '../options/DatabaseOptions';
import UserModel from '../models/UserModel';
import RoleModel from '../models/RoleModel';
import TokenModel from '../models/TokenModel';

export default class Database {
    private _sequelize: Sequelize;

    constructor(options: DatabaseOptions) {
        this.init(options);
        this.initModel(RoleModel);
        this.initModel(UserModel);
        this.initModel(TokenModel);
        this.initAssociation(RoleModel);
        this.initAssociation(UserModel);
        this.initAssociation(TokenModel);
    }

    public async auth(): Promise<void> {
        try {
            await this._sequelize.authenticate();
            console.log('Database authenticated.');    
        }
        catch (err) {
            console.error('Unable to connect to the database:', err);
        }
    }

    public async close(): Promise<void> {
        try {
            await this._sequelize.close();
            console.log('Database connection closed.');    
        }
        catch (err) {
            console.error(err);
        }
    }

    public async sync(): Promise<void> {
        try {
            await this._sequelize.sync({ force: false });
            console.log('Database tables synced.');    
        }
        catch (err) {
            console.error(err);
        }
    }

    public async syncForce(): Promise<void> {
        try {
            await this._sequelize.sync({ force: true });
            console.log('All tables recreated.');    
        }
        catch (err) {
            console.error(err);
        }
    }

    public async dropAll(): Promise<void> {
        try {
            await this._sequelize.drop();
            console.log('All tables deleted.');
        }
        catch (err) {
            console.error(err);
        }
    }

    protected initModel<T extends typeof Model, M extends { initModel: (S: Sequelize) => T }>(model: M): T {
        return <T>model.initModel(this._sequelize);
    }

    protected initAssociation<T extends { associate: () => void }>(model: T): void {
        model.associate();
    }

    private init(options: DatabaseOptions): void {
        this._sequelize = new Sequelize(options.connectionString, {
            dialect: options.dialect,
            logging: options.logging,
            pool: options.pool,
        });
    }
}
