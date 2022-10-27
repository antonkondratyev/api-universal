import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize';
import RoleModel from './RoleModel';
import TokenModel from './TokenModel';

export default class UserModel extends Model {
    public id: number;
    public name: string;
    public password: string;
    public is_admin: boolean;
    public role_id: number;
    public roles: number[];

    public static associate(): void {
        UserModel.belongsTo(RoleModel, { foreignKey: 'role_id' });
        UserModel.hasOne(TokenModel, { foreignKey: 'user_id' });
    }

    public static initModel(sequelize: Sequelize): User {
        return UserModel.init(
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
                password: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                is_admin: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },
                role_id: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    references: {
                        model: RoleModel,
                        key: 'id',
                    },
                },
                roles: {
                    type: DataTypes.ARRAY(DataTypes.INTEGER),
                    allowNull: false,
                },
            },
            {
                modelName: 'users',
                sequelize: sequelize,
                freezeTableName: true,
                underscored: true,
                updatedAt: false,
            }
        );
    }
}

export type User = typeof Model & {
    new(values?: object, options?: BuildOptions): UserModel;
};
