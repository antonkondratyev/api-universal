import DatabaseOptions from '../options/DatabaseOptions';
import Database from './Database';
import UserModel, { User } from '../models/UserModel';
import UserData from '../UserData';

export default class UserDatabase extends Database {
    public model: User;

    constructor(options: DatabaseOptions) {
        super(options);
        this.model = super.initModel(UserModel);
        super.initAssociation(UserModel);
    }

    public async addUser(name: string, password: string, isAdmin: boolean): Promise<UserModel> {
        return await this.model.create({
            name: name,
            password: password,
            is_admin: isAdmin,
        });
    }

    public async getUsersCount(): Promise<number> {
        return await this.model.count();
    }

    public async getUsers(): Promise<UserModel[]> {
        return await this.model.findAll({
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
        return await this.model.findOne({
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
        return await this.model.findOne({
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
        return await this.model.findOne({
            where: {
                name: name,
            },
        });
    }

    public async changeUser(user: UserModel, data: UserData): Promise<UserModel> {
        Object.keys(data).forEach(prop => user[prop] = data[prop]);
        return await this.updateUser(user, user);
    }

    public async updateUser(user: UserModel, data: UserData): Promise<UserModel> {
        let updatedData: [affectedCount: number, affectedRows: UserModel[]] = await this.model.update({
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
            await this.model.destroy({
                where: {
                    id: id,
                },
            });
        }
    }

    public async removeUserByName(name: string): Promise<void> {
        if (await this.isUserExists(name)) {
            await this.model.destroy({
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
        return !!await this.getUser(id);
    }

    public async isUserExistsByName(name: string): Promise<boolean> {
        return !!await this.getUser(name);
    }

    public async isAdmin(name: string): Promise<boolean> {
        let user: UserModel = await this.getUser(name);
        return !!user.is_admin;
    }
}
