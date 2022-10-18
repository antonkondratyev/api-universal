import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, ACCESS_TOKEN_EXPIRES, REFRESH_TOKEN_EXPIRES } from '../config';
import Database from '../Database';
import UserData from '../UserData';
import UserModel from '../models/UserModel';
import TokenCredentials from '../TokenCredentials';
import ResponseData from '../ResponseData';
import ResponseHandler from '../ResponseHandler';
import DatabaseOptions from '../options/DatabaseOptions';

export default class TokenService {
    private _database: Database;
    private _accessToken: string;
    private _refreshToken: string;

    constructor(options: DatabaseOptions) {
        this._database = new Database(options);
    }

    public async createTokenCredentials(user: UserData | UserModel): Promise<TokenCredentials> {
        let payload: UserData = {
            id: user.id,
            name: user.name,
        }

        this.generateTokens(payload);
        await this._database.addToken(user.id, this._refreshToken);

        return <TokenCredentials>{
            user: {
                id: user.id,
                name: user.name,
            },
            token: {
                access: this._accessToken,
                refresh: this._refreshToken,
            },
        }
    }

    public static verifyAccessToken(req: Request, res: Response, next: NextFunction): void {        
        TokenService.verify(req, res, next, ACCESS_TOKEN_SECRET);
    }

    public static verifyRefreshToken(req: Request, res: Response, next: NextFunction): void {
        TokenService.verify(req, res, next, REFRESH_TOKEN_SECRET);
    }

    private static verify(req: Request, res: Response, next: NextFunction, tokenSecret: string): void {
        let token: string = req.headers.authorization?.split(' ')[1];
        if (!token) {
            ResponseHandler.handle(res, ResponseData.create(false, 401, 'No Token Provided'));
            return;
        }

        jwt.verify(token, tokenSecret, (error: jwt.VerifyErrors, decodedUser: string | jwt.JwtPayload) => {            
            if (error) {
                ResponseHandler.handle(res, ResponseData.create(false, 401, 'Unauthorized'));
                return;
            } else {
                req.verifiedUser = <UserData>decodedUser;
                next();
            }
        });
    }

    private generateTokens(payload: UserData): void {
        this._accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
            expiresIn: ACCESS_TOKEN_EXPIRES,
        });

        this._refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
            expiresIn: REFRESH_TOKEN_EXPIRES,
        });
    }
}
