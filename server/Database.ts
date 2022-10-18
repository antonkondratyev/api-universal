import { Sequelize, Model } from 'sequelize';
import DatabaseOptions from './options/DatabaseOptions';
import UserModel, { User } from './models/UserModel';
import RoleModel, { Role } from './models/RoleModel';
import TokenModel, { Token } from './models/TokenModel';
import RoleData from './RoleData';
import UserData from './UserData';

export default class Database {
    private _sequelize: Sequelize;
    private _role: Role;
    private _user: User;
    private _token: Token;

    constructor(options: DatabaseOptions) {
        this.init(options);
        this._role = this.initModel(RoleModel);
        this._user = this.initModel(UserModel);
        this._token = this.initModel(TokenModel);
        this.initAssociation(RoleModel);
        this.initAssociation(UserModel);
        this.initAssociation(TokenModel);
    }

    public get role(): Role {
        return this._role;
    }

    public get user(): User {
        return this._user;
    }

    public get token(): Token {
        return this._token;
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

    public async getRoles(): Promise<RoleModel[]> {
        return await this._role.findAll({
            order: ['id']
        });
    }

    public async getRole(role: number | string): Promise<RoleModel> {
        if (typeof role === 'number') {
            return await this.getRoleById(role);
        }
        if (typeof role === 'string') {
            return await this.getRoleByName(role);
        }
    }

    public async getRoleById(id: number): Promise<RoleModel> {
        return await this._role.findOne({
            where: {
                id: id,
            },
        });
    }

    public async getRoleByName(name: string): Promise<RoleModel> {
        return await this._role.findOne({
            where: {
                name: name,
            },
        });
    }

    public async addRole(role: RoleData): Promise<RoleModel> {
        return await this._role.create({
            name: role.name,
            description: role.description,
        });
    }

    public async changeRole(role: RoleModel, data: RoleData): Promise<RoleModel> {
        Object.keys(data).forEach(prop => role[prop] = data[prop]);
        return await this.updateRole(role, role);
    }

    public async updateRole(role: RoleModel, data: RoleData): Promise<RoleModel> {
        let updatedData: [affectedCount: number, affectedRows: RoleModel[]] = await this._role.update({
            name: data.name,
            description: data.description,
        },{
            where: {
                id: role.id,
            },
            returning: true,
        });
        return updatedData[1][0];
    }

    public async removeRole(role: number | string): Promise<void> {
        if (typeof role === 'number') {
            await this.removeRoleById(role);
        }
        if (typeof role === 'string') {
            await this.removeRoleByName(role);
        }
    }

    public async removeRoleById(id: number): Promise<void> {
        if (await this.isRoleExists(id)) {
            await this._role.destroy({
                where: {
                    id: id,
                },
            });
        }
    }

    public async removeRoleByName(name: string): Promise<void> {
        if (await this.isRoleExists(name)) {
            await this._role.destroy({
                where: {
                    name: name,
                },
            });
        }
    }

    public async isRoleExists(role: number | string): Promise<boolean> {
        if (typeof role === 'number') {
            return await this.isRoleExistsById(role);
        }
        if (typeof role === 'string') {
            return await this.isRoleExistsByName(role);
        }
    }

    public async isRoleExistsById(id: number): Promise<boolean> {
        return !!await this._role.findOne({
            where: {
                id: id,
            },
        });
    }

    public async isRoleExistsByName(name: string): Promise<boolean> {
        return !!await this._role.findOne({
            where: {
                name: name,
            },
        });
    }

    public async getUsersCount(): Promise<number> {
        return await this._user.count();
    }

    public async getUsers(): Promise<UserModel[]> {
        return await this._user.findAll({
            order: ['id'],
            attributes: {
                exclude: [
                    'password',
                ],
            },
        });
    }

    public async getUser(user: number | string): Promise<UserModel> {
        if (typeof user === 'number') {
            return await this.getUserById(user);
        }
        if (typeof user === 'string') {
            return await this.getUserByName(user);
        }
    }

    public async getUserById(id: number): Promise<UserModel> {
        return await this._user.findOne({
            where: {
                id: id,
            },
            attributes: {
                exclude: [
                    'password',
                ],
            },
        });
    }

    public async getUserByName(name: string): Promise<UserModel> {
        return await this._user.findOne({
            where: {
                name: name,
            },
            attributes: {
                exclude: [
                    'password',
                ],
            },
        });
    }

    public async getUserWithPassword(name: string): Promise<UserModel> {
        return await this._user.findOne({
            where: {
                name: name,
            },
        });
    }

    public async addUser(name: string, password: string, isAdmin: boolean): Promise<UserModel> {
        return await this._user.create({
            name: name,
            password: password,
            is_admin: isAdmin,
        });
    }

    public async changeUser(user: UserModel, data: UserData): Promise<UserModel> {
        Object.keys(data).forEach(prop => user[prop] = data[prop]);
        return await this.updateUser(user, user);
    }

    public async updateUser(user: UserModel, data: UserData): Promise<UserModel> {
        let updatedData: [affectedCount: number, affectedRows: UserModel[]] = await this._user.update({
            name: data.name,
            password: data.password,
            is_admin: data.is_admin,
        },{
            where: {
                id: user.id,
            },
            returning: true,
        });
        return updatedData[1][0];
    }

    public async removeUser(user: number | string): Promise<void> {
        if (typeof user === 'number') {
            await this.removeUserById(user);
        }
        if (typeof user === 'string') {
            await this.removeUserByName(user);
        }
    }

    public async removeUserById(id: number): Promise<void> {
        if (await this.isUserExists(id)) {
            await this._user.destroy({
                where: {
                    id: id,
                },
            });
        }
    }

    public async removeUserByName(name: string): Promise<void> {
        if (await this.isUserExists(name)) {
            await this._user.destroy({
                where: {
                    name: name,
                },
            });
        }
    }

    public async isUserExists(user: number | string): Promise<boolean> {
        if (typeof user === 'number') {
            return await this.isUserExistsById(user);
        }
        if (typeof user === 'string') {
            return await this.isUserExistsByName(user);
        }
    }

    public async isUserExistsById(id: number): Promise<boolean> {
        return !!await this._user.findOne({
            where: {
                id: id,
            },
        });
    }

    public async isUserExistsByName(name: string): Promise<boolean> {
        return !!await this._user.findOne({
            where: {
                name: name,
            },
        });
    }

    public async isAdmin(name: string): Promise<boolean> {
        let user: UserModel = await this.getUser(name);
        return !!user.is_admin;
    }

    public async addToken(userId: number, refreshToken: string): Promise<void> {
        await this._token.create({
            user_id: userId,
            token: refreshToken,
        });
    }

    public async getToken(token: string): Promise<TokenModel> {
        return await this._token.findOne({
            where: {
                token: token,
            },
        });
    }

    public async getTokenById(id: number): Promise<TokenModel> {
        return await this._token.findOne({
            where: {
                user_id: id,
            },
        });
    }

    public async removeToken(token: string): Promise<void> {
        if (await this.isTokenExists(token)) {
            await this._token.destroy({
                where: {
                    token: token,
                },
            });
        }
    }

    public async removeTokenById(id: number): Promise<void> {
        if (await this.isTokenExistsById(id)) {
            await this._token.destroy({
                where: {
                    user_id: id,
                },
            });
        }
    }

    public async isTokenExists(token: string): Promise<boolean> {
        return !!await this._token.findOne({
            where: {
                token: token,
            },
        });
    }

    public async isTokenExistsById(id: number): Promise<boolean> {
        return !!await this._token.findOne({
            where: {
                user_id: id,
            }
        });
    }

    private initModel<T extends typeof Model, M extends { initModel: (S: Sequelize) => T }>(model: M): T {
        return <T>model.initModel(this._sequelize);
    }

    private initAssociation<T extends { associate: () => void }>(model: T): void {
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
