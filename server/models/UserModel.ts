import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize';
import RoleModel from './RoleModel';
import TokenModel from './TokenModel';

export default class UserModel extends Model {
    public id: number;
    public name: string;
    public password: string;
    public is_admin: boolean;
    public role_id: number;
    // public additional_roles: DataTypes.StringDataType[];

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
                // id: {
                //     type: DataTypes.UUID,
                //     defaultValue: DataTypes.UUIDV4,
                //     primaryKey: true,
                //     allowNull: false,
                //     unique: true,
                // },
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
                // additional_roles: {
                //     type: DataTypes.ARRAY(DataTypes.STRING),
                //     allowNull: true,
                // },
            },
            {
                modelName: 'users',
                sequelize: sequelize,
                freezeTableName: true,
                updatedAt: false,
            }
        );
    }
}

export type User = typeof Model & {
    new(values?: object, options?: BuildOptions): UserModel;
};
