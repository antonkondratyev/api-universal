import DatabaseOptions from '../options/DatabaseOptions';
import DatabaseList from '../database/DatabaseList';
import RoleDatabase from '../database/RoleDatabase';
import UserDatabase from '../database/UserDatabase';
import ResponseData from '../ResponseData';
import UserData from '../UserData';
import RoleData from '../RoleData';
import RoleModel from '../models/RoleModel';

export default class RoleService {
    private _database: DatabaseList = new DatabaseList();

    constructor(options: DatabaseOptions) {
        this._database.role = new RoleDatabase(options);
        this._database.user = new UserDatabase(options);
    }

    public async getRoles(): Promise<ResponseData> {
        try {
            let roles: RoleModel[] = await this._database.role.getRoles();
            return ResponseData.create(true, 200, 'Success', roles);
        } catch (err) {
            console.error(err);
            return ResponseData.create(false, 500, 'Internal Server Error');
        }
    }

    public async getRole(idOrName: number | string): Promise<ResponseData> {
        try {
            let role: RoleModel = await this._database.role.getRole(idOrName);
            if (role) {
                return ResponseData.create(true, 200, 'Success', role);
            } else {
                return ResponseData.create(false, 400, 'Role Not Exists');
            }
        } catch (err) {
            console.error(err);
            return ResponseData.create(false, 500, 'Internal Server Error');
        }
    }

    public async addRole(authUser: UserData, role: RoleData): Promise<ResponseData> {
        try {
            let isAdmin: boolean = await this._database.user.isAdmin(authUser.name);
            if (isAdmin) {
                if (!await this._database.role.isRoleExists(role.name)) {
                    let createdRole: RoleModel = await this._database.role.addRole(role);
                    return ResponseData.create(true, 200, 'Role Successfully Added', createdRole);
                } else {
                    return ResponseData.create(false, 400, 'Role Already Exists');
                }
            } else {
                return ResponseData.create(false, 403, 'User Not Admin');
            }
        } catch (err) {
            console.error(err);
            return ResponseData.create(false, 500, 'Internal Server Error');
        }
    }

    public async changeRole(authUser: UserData, roleIdOrName: number | string, data: RoleData): Promise<ResponseData> {
        try {
            let isAdmin: boolean = await this._database.user.isAdmin(authUser.name);
            if (isAdmin) {
                let role: RoleModel = await this._database.role.getRole(roleIdOrName);
                if (role) {
                    let updatedRole: RoleModel = await this._database.role.changeRole(role, data);
                    return ResponseData.create(true, 200, 'Role Successfully Changed', updatedRole);
                } else {
                    return ResponseData.create(false, 400, 'Role Not Exists');
                }
            } else {
                return ResponseData.create(false, 403, 'User Not Admin');
            }
        } catch (err) {
            console.error(err);
            return ResponseData.create(false, 500, 'Internal Server Error');
        }
    }

    public async updateRole(authUser: UserData, roleIdOrName: number | string, data: RoleData): Promise<ResponseData> {
        try {
            let isAdmin: boolean = await this._database.user.isAdmin(authUser.name);
            if (isAdmin) {
                let role: RoleModel = await this._database.role.getRole(roleIdOrName);
                if (role) {
                    let updatedRole: RoleModel = await this._database.role.updateRole(role, data);
                    return ResponseData.create(true, 200, 'Role Successfully Updated', updatedRole);
                } else {
                    return ResponseData.create(false, 400, 'Role Not Exists');
                }
            } else {
                return ResponseData.create(false, 403, 'User Not Admin');
            }
        } catch (err) {
            console.error(err);
            return ResponseData.create(false, 500, 'Internal Server Error');
        }
    }

    public async removeRole(authUser: UserData, roleIdOrName: number | string): Promise<ResponseData> {
        try {
            let isAdmin: boolean = await this._database.user.isAdmin(authUser.name);
            if (isAdmin) {
                if (await this._database.role.isRoleExists(roleIdOrName)) {
                    await this._database.role.removeRole(roleIdOrName);
                    return ResponseData.create(true, 200, 'Role Successfully Removed');
                } else {
                    return ResponseData.create(false, 400, 'Role Not Exists');
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
