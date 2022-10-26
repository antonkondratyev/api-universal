import DatabaseOptions from '../options/DatabaseOptions';
import Database from './Database';
import RoleModel, { Role } from '../models/RoleModel';
import RoleData from '../RoleData';

export default class RoleDatabase extends Database {
    public model: Role;

    constructor(options: DatabaseOptions) {
        super(options);
        this.model = super.initModel(RoleModel);
        super.initAssociation(RoleModel);
    }

    public async getRoles(): Promise<RoleModel[]> {
        return await this.model.findAll({
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
        return await this.model.findOne({
            where: {
                id: id,
            },
        });
    }

    public async getRoleByName(name: string): Promise<RoleModel> {
        return await this.model.findOne({
            where: {
                name: name,
            },
        });
    }

    public async addRole(role: RoleData): Promise<RoleModel> {
        return await this.model.create({
            name: role.name,
            description: role.description,
        });
    }

    public async changeRole(role: RoleModel, data: RoleData): Promise<RoleModel> {
        Object.keys(data).forEach(prop => role[prop] = data[prop]);
        return await this.updateRole(role, role);
    }

    public async updateRole(role: RoleModel, data: RoleData): Promise<RoleModel> {
        let updatedData: [affectedCount: number, affectedRows: RoleModel[]] = await this.model.update({
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
            await this.model.destroy({
                where: {
                    id: id,
                },
            });
        }
    }

    public async removeRoleByName(name: string): Promise<void> {
        if (await this.isRoleExists(name)) {
            await this.model.destroy({
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
        return !!await this.model.findOne({
            where: {
                id: id,
            },
        });
    }

    public async isRoleExistsByName(name: string): Promise<boolean> {
        return !!await this.model.findOne({
            where: {
                name: name,
            },
        });
    }
}
