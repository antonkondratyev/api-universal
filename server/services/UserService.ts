import DatabaseOptions from '../options/DatabaseOptions';
import DatabaseList from '../database/DatabaseList';
import UserDatabase from '../database/UserDatabase';
import AuthService from './AuthService';
import ResponseData from '../ResponseData';
import UserData from '../UserData';
import UserModel from '../models/UserModel';

export default class UserService {
    private _database: DatabaseList = new DatabaseList();

    constructor(options: DatabaseOptions) {
        this._database.user = new UserDatabase(options);
    }

    public async getUsers(): Promise<ResponseData> {
        try {
            let users: UserModel[] = await this._database.user.getUsers();
            return ResponseData.create(true, 200, 'Success', users);
        } catch (err) {
            console.error(err);
            return ResponseData.create(false, 500, 'Internal Server Error');
        }
    }

    public async getUser(idOrName: number | string): Promise<ResponseData> {
        try {
            let user: UserModel = await this._database.user.getUser(idOrName);
            if (user) {
                return ResponseData.create(true, 200, 'Success', user);
            } else {
                return ResponseData.create(false, 400, 'User Not Exists');
            }
        } catch (err) {
            console.error(err);
            return ResponseData.create(false, 500, 'Internal Server Error');
        }
    }

    public async addUser(authUser: UserData, newUser: UserData): Promise<ResponseData> {
        try {
            let isAdmin: boolean = await this._database.user.isAdmin(authUser.name);
            if (isAdmin) {
                if (!await this._database.user.isUserExists(newUser.name)) {
                    let hashedPassword: string = AuthService.createHash(newUser.password);
                    let createdUser: UserModel = await this._database.user.addUser(newUser.name, hashedPassword, newUser.is_admin);
                    let user: UserData = await this._database.user.getUser(createdUser.id);
                    return ResponseData.create(true, 200, 'User Successfully Added', user);
                } else {
                    return ResponseData.create(false, 400, 'User Already Exists');
                }
            } else {
                return ResponseData.create(false, 403, 'User Not Admin');
            }
        } catch (err) {
            console.error(err);
            return ResponseData.create(false, 500, 'Internal Server Error');
        }
    }

    public async removeUser(authUser: UserData, userIdOrName: number | string): Promise<ResponseData> {
        try {
            let isAdmin: boolean = await this._database.user.isAdmin(authUser.name);
            if (isAdmin) {
                if (await this._database.user.isUserExists(userIdOrName)) {
                    await this._database.user.removeUser(userIdOrName);
                    return ResponseData.create(true, 200, 'User Successfully Removed');
                } else {
                    return ResponseData.create(false, 400, 'User Not Exists');
                }
            } else {
                return ResponseData.create(false, 403, 'User Not Admin');
            }
        } catch (err) {
            console.error(err);
            return ResponseData.create(false, 500, 'Internal Server Error');
        }
    }
}
