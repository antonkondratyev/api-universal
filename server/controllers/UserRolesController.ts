import { Request, Response } from 'express';
import Controller from '../Controller';
import Methods from '../Methods';
import Route from '../Route';
import ResponseData from '../ResponseData';
import ResponseHandler from '../ResponseHandler';
import UserService from '../services/UserService';
import TokenService from '../services/TokenService';
import DatabaseOptions from '../options/DatabaseOptions';
import UserController from './UserController';

export default class UserRolesController extends UserController {
    public readonly path: string = '/users';
    public readonly routes: Route[] = [
        {
            path: '/:user/roles',
            method: Methods.GET,
            handler: this.getUserRoles,
            middleware: [TokenService.verifyAccessToken],
        },
        {
            path: '/:user/roles',
            method: Methods.POST,
            handler: this.addUserRole,
            middleware: [TokenService.verifyAccessToken],
        },
        {
            path: '/:user/roles/:role',
            method: Methods.DELETE,
            handler: this.removeUserRole,
            middleware: [TokenService.verifyAccessToken],
        },
    ];

    private async getUserRoles(req: Request, res: Response): Promise<void> {
        try {
            if (req.verifiedUser) {
                let databaseOptions: DatabaseOptions = Controller.getDatabaseOptions(req);
                let userService: UserService = new UserService(databaseOptions);
                let user: number | string = Number(req.params.user) || String(req.params.user);
                let data: ResponseData = await userService.getUserRoles(user);
                ResponseHandler.handle(res, data);
            } else {
                ResponseHandler.sendError(res, 'Unverified Request')
            }
        } catch (err) {
            console.error(err);
            ResponseHandler.sendError(res);
        }
    }

    private async addUserRole(req: Request, res: Response): Promise<void> {
        try {
            if (req.verifiedUser) {
                let databaseOptions: DatabaseOptions = Controller.getDatabaseOptions(req);
                let userService: UserService = new UserService(databaseOptions);
                let user: number | string = Number(req.params.user) || String(req.params.user);
                let data: ResponseData = await userService.addUserRole(req.verifiedUser, user, req.body);
                ResponseHandler.handle(res, data);
            } else {
                ResponseHandler.sendError(res, 'Unverified Request')
            }
        } catch (err) {
            console.error(err);
            ResponseHandler.sendError(res);
        }
    }

    private async removeUserRole(req: Request, res: Response): Promise<void> {
        try {
            if (req.verifiedUser) {
                let databaseOptions: DatabaseOptions = Controller.getDatabaseOptions(req);
                let userService: UserService = new UserService(databaseOptions);
                let user: number | string = Number(req.params.user) || String(req.params.user);
                let roleId: number = Number(req.params.role);
                let data: ResponseData = await userService.removeUserRole(req.verifiedUser, user, roleId);
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
