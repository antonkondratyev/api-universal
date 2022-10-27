import DatabaseOptions from '../options/DatabaseOptions';
import DatabaseList from '../database/DatabaseList';
import RoleDatabase from '../database/RoleDatabase';
import UserDatabase from '../database/UserDatabase';
import AuthService from './AuthService';
import ResponseData from '../ResponseData';
import UserData from '../UserData';
import UserModel from '../models/UserModel';

export default class UserService {
    private _database: DatabaseList = new DatabaseList();

    constructor(options: DatabaseOptions) {
        this._database.role = new RoleDatabase(options);
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
            let isAdmin: boolean = await this._database.user.isAdmin(authUser.id);
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

    public async changeUser(authUser: UserData, userIdOrName: number | string, data: UserData): Promise<ResponseData> {
        try {
            let isAdmin: boolean = await this._database.user.isAdmin(authUser.id);
            if (isAdmin) {
                let user: UserModel = await this._database.user.getUser(userIdOrName);
                if (user) {
                    if (data.password) {
                        data.password = AuthService.createHash(data.password);
                    }
                    await this._database.user.changeUser(user, data);
                    let changedUser: UserData = await this._database.user.getUser(user.id);
                    return ResponseData.create(true, 200, 'User Successfully Changed', changedUser);
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

    public async updateUser(authUser: UserData, userIdOrName: number | string, data: UserData): Promise<ResponseData> {
        try {
            let isAdmin: boolean = await this._database.user.isAdmin(authUser.id);
            if (isAdmin) {
                let user: UserModel = await this._database.user.getUser(userIdOrName);
                if (user) {
                    if (data.password) {
                        data.password = AuthService.createHash(data.password);
                    }
                    await this._database.user.updateUser(user, data);
                    let updatedUser: UserData = await this._database.user.getUser(user.id);
                    return ResponseData.create(true, 200, 'User Successfully Updated', updatedUser);
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

    public async removeUser(authUser: UserData, userIdOrName: number | string): Promise<ResponseData> {
        try {
            let isAdmin: boolean = await this._database.user.isAdmin(authUser.id);
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

    public async getUserRoles(userIdOrName: number | string): Promise<ResponseData> {
        try {
            let user: UserModel = await this._database.user.getUser(userIdOrName);
            return ResponseData.create(true, 200, 'Success', user.roles);
        } catch (err) {
            console.error(err);
            return ResponseData.create(false, 500, 'Internal Server Error');
        }
    }

    public async addUserRole(authUser: UserData, userIdOrName: number | string, rolesId: number[]): Promise<ResponseData> {
        try {
            let isAdmin: boolean = await this._database.user.isAdmin(authUser.id);
            if (isAdmin) {
                let user: UserModel = await this._database.user.getUser(userIdOrName);
                let validRoles: number[] = await this.getValidRoles(rolesId);
                if (validRoles.length !== 0) {
                    validRoles.forEach(roleId => {
                        if (user.roles.indexOf(roleId) === -1) {
                            user.roles.push(roleId);
                            user.roles.sort(this.sortNumAsc);
                        }
                    });
                    await this._database.user.updateUser(user, user);
                    let updatedUser: UserData = await this._database.user.getUser(user.id);
                    return ResponseData.create(true, 200, 'User Roles Successfully Updated', updatedUser);
                } else {
                    return ResponseData.create(false, 400, 'Roles Not Valid');
                }
            } else {
                return ResponseData.create(false, 403, 'User Not Admin');
            }
        } catch (err) {
            console.error(err);
            return ResponseData.create(false, 500, 'Internal Server Error');
        }
    }

    public async removeUserRole(authUser: UserData, userIdOrName: number | string, roleId: number): Promise<ResponseData> {
        try {
            let isAdmin: boolean = await this._database.user.isAdmin(authUser.id);
            if (isAdmin) {
                let user: UserModel = await this._database.user.getUser(userIdOrName);
                if (user.roles.some(r => r === roleId)) {
                    user.roles = user.roles.filter(r => r !== roleId);
                    await this._database.user.updateUser(user, user);
                } else {
                    return ResponseData.create(false, 400, 'Roles Not Exists');
                }
                let updatedUser: UserData = await this._database.user.getUser(user.id);
                return ResponseData.create(true, 200, 'User Roles Successfully Updated', updatedUser);
            } else {
                return ResponseData.create(false, 403, 'User Not Admin');
            }
        } catch (err) {
            console.error(err);
            return ResponseData.create(false, 500, 'Internal Server Error');
        }
    }

    private async getValidRoles(rolesId: number[]): Promise<number[]> {
        let validRoles: Promise<number>[] = rolesId.map(async roleId => {
            if (await this._database.role.isRoleExists(roleId)) return roleId;
        });
        return (await Promise.all(validRoles)).filter(r => typeof r === 'number');
    }

    private sortNumAsc(first: number, second: number): 1 | 0 | -1 {
        if (first > second) return 1;
        if (first === second) return 0;
        if (first < second) return -1;
    }
}
