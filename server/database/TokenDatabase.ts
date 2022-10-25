import DatabaseOptions from '../options/DatabaseOptions';
import Database from '../Database';
import TokenModel, { Token } from '../models/TokenModel';

export default class TokenDatabase extends Database {
    public model: Token;

    constructor(options: DatabaseOptions) {
        super(options);
        this.model = super.initModel(TokenModel);
        super.initAssociation(TokenModel);
    }

    public async addToken(userId: number, refreshToken: string): Promise<void> {
        await this.model.create({
            user_id: userId,
            token: refreshToken,
        });
    }

    public async getToken(token: string): Promise<TokenModel> {
        return await this.model.findOne({
            where: {
                token: token,
            },
        });
    }

    public async getTokenById(id: number): Promise<TokenModel> {
        return await this.model.findOne({
            where: {
                user_id: id,
            },
        });
    }

    public async removeToken(token: string): Promise<void> {
        if (await this.isTokenExists(token)) {
            await this.model.destroy({
                where: {
                    token: token,
                },
            });
        }
    }

    public async removeTokenById(id: number): Promise<void> {
        if (await this.isTokenExistsById(id)) {
            await this.model.destroy({
                where: {
                    user_id: id,
                },
            });
        }
    }

    public async isTokenExists(token: string): Promise<boolean> {
        return !!await this.model.findOne({
            where: {
                token: token,
            },
        });
    }

    public async isTokenExistsById(id: number): Promise<boolean> {
        return !!await this.model.findOne({
            where: {
                user_id: id,
            }
        });
    }
}
