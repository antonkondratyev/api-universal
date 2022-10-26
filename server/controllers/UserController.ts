import { Request, Response } from 'express';
import Controller from '../Controller';
import Methods from '../Methods';
import Route from '../Route';
import ResponseData from '../ResponseData';
import ResponseHandler from '../ResponseHandler';
import UserService from '../services/UserService';
import TokenService from '../services/TokenService';
import DatabaseOptions from '../options/DatabaseOptions';

export default class UserController extends Controller {
    public readonly path: string = '/users';
    public readonly routes: Route[] = [
        {
            path: '/',
            method: Methods.GET,
            handler: this.getUsers,
            middleware: [TokenService.verifyAccessToken],
        },
        {
            path: '/:user',
            method: Methods.GET,
            handler: this.getUser,
            middleware: [TokenService.verifyAccessToken],
        },
        {
            path: '/',
            method: Methods.POST,
            handler: this.addUser,
            middleware: [TokenService.verifyAccessToken],
        },
        {
            path: '/:user',
            method: Methods.PATCH,
            handler: this.changeUser,
            middleware: [TokenService.verifyAccessToken],
        },
        {
            path: '/:user',
            method: Methods.PUT,
            handler: this.updateUser,
            middleware: [TokenService.verifyAccessToken],
        },
        {
            path: '/:user',
            method: Methods.DELETE,
            handler: this.removeUser,
            middleware: [TokenService.verifyAccessToken],
        },
    ];

    private async getUsers(req: Request, res: Response): Promise<void> {
        try {
            if (req.verifiedUser) {
                let databaseOptions: DatabaseOptions = Controller.getDatabaseOptions(req);
                let userService: UserService = new UserService(databaseOptions);
                let data: ResponseData = await userService.getUsers();
                ResponseHandler.handle(res, data);
            } else {
                ResponseHandler.sendError(res, 'Unverified Request')
            }
        } catch (err) {
            console.error(err);
            ResponseHandler.sendError(res);
        }
    }

    private async getUser(req: Request, res: Response): Promise<void> {
        try {
            if (req.verifiedUser) {
                let databaseOptions: DatabaseOptions = Controller.getDatabaseOptions(req);
                let userService: UserService = new UserService(databaseOptions);
                let user: number | string = Number(req.params.user) || String(req.params.user);
                let data: ResponseData = await userService.getUser(user);
                ResponseHandler.handle(res, data);
            } else {
                ResponseHandler.sendError(res, 'Unverified Request')
            }
        } catch (err) {
            console.error(err);
            ResponseHandler.sendError(res);
        }
    }

    private async addUser(req: Request, res: Response): Promise<void> {
        try {
            if (req.verifiedUser) {
                let databaseOptions: DatabaseOptions = Controller.getDatabaseOptions(req);
                let userService: UserService = new UserService(databaseOptions);
                let data: ResponseData = await userService.addUser(req.verifiedUser, req.body);
                ResponseHandler.handle(res, data);
            } else {
                ResponseHandler.sendError(res, 'Unverified Request')
            }
        } catch (err) {
            console.error(err);
            ResponseHandler.sendError(res);
        }
    }

    private async changeUser(req: Request, res: Response): Promise<void> {
        try {
            if (req.verifiedUser) {
                let databaseOptions: DatabaseOptions = Controller.getDatabaseOptions(req);
                let userService: UserService = new UserService(databaseOptions);
                let user: number | string = Number(req.params.user) || String(req.params.user);
                let data: ResponseData = await userService.changeUser(req.verifiedUser, user, req.body);
                ResponseHandler.handle(res, data);
            } else {
                ResponseHandler.sendError(res, 'Unverified Request')
            }
        } catch (err) {
            console.error(err);
            ResponseHandler.sendError(res);
        }
    }

    private async updateUser(req: Request, res: Response): Promise<void> {
        try {
            if (req.verifiedUser) {
                let databaseOptions: DatabaseOptions = Controller.getDatabaseOptions(req);
                let userService: UserService = new UserService(databaseOptions);
                let user: number | string = Number(req.params.user) || String(req.params.user);
                let data: ResponseData = await userService.updateUser(req.verifiedUser, user, req.body);
                ResponseHandler.handle(res, data);
            } else {
                ResponseHandler.sendError(res, 'Unverified Request')
            }
        } catch (err) {
            console.error(err);
            ResponseHandler.sendError(res);
        }
    }

    private async removeUser(req: Request, res: Response): Promise<void> {
        try {
            if (req.verifiedUser) {
                let databaseOptions: DatabaseOptions = Controller.getDatabaseOptions(req);
                let userService: UserService = new UserService(databaseOptions);
                let user: number | string = Number(req.params.user) || String(req.params.user);
                let data: ResponseData = await userService.removeUser(req.verifiedUser, user);
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
