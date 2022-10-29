import { Request, Response } from 'express';
import Controller from '../Controller';
import Methods from '../Methods';
import Route from '../Route';
import ResponseData from '../ResponseData';
import ResponseHandler from '../ResponseHandler';
import AuthService from '../services/AuthService';
import TokenService from '../services/TokenService';
import DatabaseOptions from '../options/DatabaseOptions';

export default class AuthController extends Controller {
    public readonly path: string = '/auth';
    public readonly routes: Route[] = [
        {
            path: '/register',
            method: Methods.POST,
            handler: this.register,
            middleware: [AuthService.validateCredentials],
        },
        {
            path: '/login',
            method: Methods.POST,
            handler: this.login,
            middleware: [AuthService.validateCredentials],
        },
        {
            path: '/logout',
            method: Methods.POST,
            handler: this.logout,
            middleware: [TokenService.verifyAccessToken],
        },
        {
            path: '/token',
            method: Methods.POST,
            handler: this.access,
            middleware: [TokenService.verifyAccessToken],
        },
        {
            path: '/refresh',
            method: Methods.POST,
            handler: this.refresh,
            middleware: [TokenService.verifyRefreshToken],
        },
    ];

    private async register(req: Request, res: Response): Promise<void> {
        try {
            let { username, password } = req.body;
            let databaseOptions: DatabaseOptions = Controller.getDatabaseOptions(req);
            let authService: AuthService = new AuthService(databaseOptions, username, password);
            let data: ResponseData = await authService.register();
            ResponseHandler.handle(res, data);
        } catch (err) {
            console.error(err);
            ResponseHandler.sendError(res);
        }
    }

    private async login(req: Request, res: Response): Promise<void> {
        try {
            let { username, password } = req.body;
            let databaseOptions: DatabaseOptions = Controller.getDatabaseOptions(req);
            let authService: AuthService = new AuthService(databaseOptions, username, password);
            let data: ResponseData = await authService.login();
            ResponseHandler.handle(res, data);
        } catch (err) {
            console.error(err);
            ResponseHandler.sendError(res);
        }
    }

    private async logout(req: Request, res: Response): Promise<void> {
        try {
            if (req.verifiedUser) {
                let databaseOptions: DatabaseOptions = Controller.getDatabaseOptions(req);
                let authService: AuthService = new AuthService(databaseOptions);
                let data: ResponseData = await authService.logout(req.verifiedUser);
                ResponseHandler.handle(res, data);
            } else {
                ResponseHandler.sendError(res, 'Unverified Request')
            }
        } catch (err) {
            console.error(err);
            ResponseHandler.sendError(res);
        }
    }

    private access(req: Request, res: Response): void {
        if (req.verifiedUser) {
            ResponseHandler.sendSuccess(res, {
                access: true,
                user: req.verifiedUser,
            });
        }
    }

    private async refresh(req: Request, res: Response): Promise<void> {
        try {
            if (req.verifiedUser) {
                let databaseOptions: DatabaseOptions = Controller.getDatabaseOptions(req);
                let authService: AuthService = new AuthService(databaseOptions);
                let token: string = req.headers.authorization?.split(' ')[1];
                let data: ResponseData = await authService.updateTokenCredentials(req.verifiedUser, token);
                ResponseHandler.handle(res, data);
            } else {
                ResponseHandler.sendError(res, 'Unverified Request')
            }
        } catch (err) {
            console.error(err);
            ResponseHandler.sendError(res);
        }
    }
}
