import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize';
import UserModel from './UserModel';

export default class TokenModel extends Model {
    public user_id: number;
    public token: string;

    public static associate(): void {
        TokenModel.belongsTo(UserModel, { foreignKey: 'user_id' });
    }

    public static initModel(sequelize: Sequelize): Token {
        return TokenModel.init(
            {
                user_id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    allowNull: false,
                    unique: true,
                    references: {
                        model: UserModel,
                        key: 'id',
                    },
                },
                token: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
            },
            {
                modelName: 'tokens',
                sequelize: sequelize,
                freezeTableName: true,
                underscored: true,
            }
        );
    }
}

export type Token = typeof Model & {
    new (values?: object, options?: BuildOptions): TokenModel;
};
