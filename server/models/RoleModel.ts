import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize';
import UserModel from './UserModel';

export default class RoleModel extends Model {
    public id: number;
    public name: string;
    public description: string;

    public static associate(): void {
        RoleModel.hasOne(UserModel, { foreignKey: 'role_id' });
    }

    public static initModel(sequelize: Sequelize): Role {
        return RoleModel.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                    allowNull: false,
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true,
                },
                description: {
                    type: DataTypes.STRING,
                    allowNull: true,
                    unique: false,
                },
            },
            {
                modelName: 'roles',
                sequelize: sequelize,
                freezeTableName: true,
                timestamps: false,
            }
        );
    }
}

export type Role = typeof Model & {
    new (values?: object, options?: BuildOptions): RoleModel;
};
