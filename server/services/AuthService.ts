import * as bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import DatabaseOptions from '../options/DatabaseOptions';
import CredentialOptions from '../options/CredentialOptions';
import DatabaseList from '../database/DatabaseList';
import UserDatabase from '../database/UserDatabase';
import TokenDatabase from '../database/TokenDatabase';
import TokenService from './TokenService';
import TokenCredentials from '../TokenCredentials';
import ResponseData from '../ResponseData';
import ResponseHandler from '../ResponseHandler';
import UserData from '../UserData';
import UserModel from '../models/UserModel';

export default class AuthService {
    private _database: DatabaseList = new DatabaseList();
    private _tokenService: TokenService;
    private readonly _username: string;
    private readonly _password: string;

    constructor(options: DatabaseOptions, username?: string, password?: string) {
        this._database.user = new UserDatabase(options);
        this._database.token = new TokenDatabase(options);
        this._tokenService = new TokenService(options);
        this._username = username.toLowerCase();
        this._password = password;
    }

    public async register(): Promise<ResponseData> {
        try {
            let user: UserModel = await this._database.user.getUser(this._username);
            if (!user) {
                let count: number = await this._database.user.getUsersCount();
                let isAdmin: boolean = count === 0 ? true : false;
                let hashedPassword: string = AuthService.createHash(this._password);
                let createdUser: UserModel = await this._database.user.addUser(this._username, hashedPassword, isAdmin);
                let credentials: TokenCredentials = await this._tokenService.createTokenCredentials(createdUser);
                return ResponseData.create(true, 201, 'User Successfully Registered', credentials);
            } else {
                return ResponseData.create(false, 400, 'User Already Exists');
            }
        } catch (err) {
            console.error(err);
            return ResponseData.create(false, 500, 'Internal Server Error');
        }
    }

    public async login(): Promise<ResponseData> {
        try {
            let user: UserModel = await this._database.user.getUserWithPassword(this._username);
            if (user) {
                if (await this.isPasswordEqual(this._password, user.password)) {
                    return await this.updateTokenCredentials(user);
                } else {
                    return ResponseData.create(false, 401, 'Incorrect Password');
                }
            } else {
                return ResponseData.create(false, 404, 'User Not Found');
            }
        } catch (err) {
            console.error(err);
            return ResponseData.create(false, 500, 'Internal Server Error');
        }
    }

    public async logout(user: UserData): Promise<ResponseData> {
        this._database.token.removeTokenById(user.id);
        return ResponseData.create(true, 200, 'User Logged Out');
    }

    public async updateTokenCredentials(user: UserData, refreshToken?: string): Promise<ResponseData> {
        try {
            if (refreshToken) {
                if (await this._database.token.isTokenExists(refreshToken)) {
                    await this._database.token.removeToken(refreshToken);
                } else {
                    return ResponseData.create(false, 401, 'Token Not Valid');
                }
            } else {
                if (await this._database.token.isTokenExistsById(user.id)) {
                    await this._database.token.removeTokenById(user.id);
                }
            }

            let credentials: TokenCredentials = await this._tokenService.createTokenCredentials(user);
            return ResponseData.create(true, 200, 'Token Regenerated', credentials);
        } catch (err) {
            console.error(err);
            return ResponseData.create(false, 500, 'Internal Server Error');
        }
    }

    public static validateCredentials(req: Request, res: Response, next: NextFunction): void {
        let cred: CredentialOptions = req.app.get('credentials');
        let { username, password } = req.body;

        try {
            if (!username || !password) {
                throw 'Username and Password required';
            }

            if (!validator.isAlphanumeric(username, 'en-US')) {
                throw 'Username must be alphanumeric';
            }

            if (!validator.isLength(username, {
                min: cred.userMinLength,
                max: cred.userMaxLength,
            })) {
                throw `Invalid username: min ${cred.userMinLength}, max ${cred.userMaxLength}`;
            }

            if (!validator.isStrongPassword(password, {
                minLength: cred.passMinLength,
                minNumbers: cred.passMinNumbers,
                minSymbols: cred.passMinSymbols,
                minUppercase: cred.passMinUpper,
                minLowercase: cred.passMinLower,
            })) {
                throw `Invalid password: min ${cred.passMinLength} characters, ${cred.passMinUpper} uppercase, ${cred.passMinLower} lowercase, ${cred.passMinNumbers} numbers, ${cred.passMinSymbols} symbols`;
            }

            next();
        } catch (err) {
            ResponseHandler.handle(res, ResponseData.create(false, 400, err));
        }
    }

    public static createHash(password: string): string {
        return bcrypt.hashSync(password);
    }

    private async isPasswordEqual(first: string, second: string): Promise<boolean> {
        return await bcrypt.compare(first, second);
    }
}
