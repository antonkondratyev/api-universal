import { Request, Response } from 'express';
import Controller from '../Controller';
import Methods from '../Methods';
import Route from '../Route';
import ResponseData from '../ResponseData';
import ResponseHandler from '../ResponseHandler';
import RoleService from '../services/RoleService';
import TokenService from '../services/TokenService';
import DatabaseOptions from '../options/DatabaseOptions';

export default class RoleController extends Controller {
    public readonly path: string = '/roles';
    public readonly routes: Route[] = [
        {
            path: '/',
            method: Methods.GET,
            handler: this.getRoles,
            middleware: [TokenService.verifyAccessToken],
        },
        {
            path: '/:role',
            method: Methods.GET,
            handler: this.getRole,
            middleware: [TokenService.verifyAccessToken],
        },
        {
            path: '/',
            method: Methods.POST,
            handler: this.addRole,
            middleware: [TokenService.verifyAccessToken],
        },
        {
            path: '/:role',
            method: Methods.PATCH,
            handler: this.changeRole,
            middleware: [TokenService.verifyAccessToken],
        },
        {
            path: '/:role',
            method: Methods.PUT,
            handler: this.updateRole,
            middleware: [TokenService.verifyAccessToken],
        },
        {
            path: '/:role',
            method: Methods.DELETE,
            handler: this.removeRole,
            middleware: [TokenService.verifyAccessToken],
        },
    ];

    private async getRoles(req: Request, res: Response): Promise<void> {
        try {
            if (req.verifiedUser) {
                let databaseOptions: DatabaseOptions = Controller.getDatabaseOptions(req);
                let roleService: RoleService = new RoleService(databaseOptions);
                let data: ResponseData = await roleService.getRoles();
                ResponseHandler.handle(res, data);
            } else {
                ResponseHandler.sendError(res, 'Unverified Request')
            }
        } catch (err) {
            console.error(err);
            ResponseHandler.sendError(res);
        }
    }

    private async getRole(req: Request, res: Response): Promise<void> {
        try {
            if (req.verifiedUser) {
                let databaseOptions: DatabaseOptions = Controller.getDatabaseOptions(req);
                let roleService: RoleService = new RoleService(databaseOptions);
                let role: number | string = Number(req.params.role) || String(req.params.role);
                let data: ResponseData = await roleService.getRole(role);
                ResponseHandler.handle(res, data);
            } else {
                ResponseHandler.sendError(res, 'Unverified Request')
            }
        } catch (err) {
            console.error(err);
            ResponseHandler.sendError(res);
        }
    }

    private async addRole(req: Request, res: Response): Promise<void> {
        try {
            if (req.verifiedUser) {
                let databaseOptions: DatabaseOptions = Controller.getDatabaseOptions(req);
                let roleService: RoleService = new RoleService(databaseOptions);
                let data: ResponseData = await roleService.addRole(req.verifiedUser, req.body);
                ResponseHandler.handle(res, data);
            } else {
                ResponseHandler.sendError(res, 'Unverified Request')
            }
        } catch (err) {
            console.error(err);
            ResponseHandler.sendError(res);
        }
    }

    private async changeRole(req: Request, res: Response): Promise<void> {
        try {
            if (req.verifiedUser) {
                let databaseOptions: DatabaseOptions = Controller.getDatabaseOptions(req);
                let roleService: RoleService = new RoleService(databaseOptions);
                let role: number | string = Number(req.params.role) || String(req.params.role);
                let data: ResponseData = await roleService.changeRole(req.verifiedUser, role, req.body);
                ResponseHandler.handle(res, data);
            } else {
                ResponseHandler.sendError(res, 'Unverified Request')
            }
        } catch (err) {
            console.error(err);
            ResponseHandler.sendError(res);
        }
    }

    private async updateRole(req: Request, res: Response): Promise<void> {
        try {
            if (req.verifiedUser) {
                let databaseOptions: DatabaseOptions = Controller.getDatabaseOptions(req);
                let roleService: RoleService = new RoleService(databaseOptions);
                let role: number | string = Number(req.params.role) || String(req.params.role);
                let data: ResponseData = await roleService.updateRole(req.verifiedUser, role, req.body);
                ResponseHandler.handle(res, data);
            } else {
                ResponseHandler.sendError(res, 'Unverified Request')
            }
        } catch (err) {
            console.error(err);
            ResponseHandler.sendError(res);
        }
    }

    private async removeRole(req: Request, res: Response): Promise<void> {
        try {
            if (req.verifiedUser) {
                let databaseOptions: DatabaseOptions = Controller.getDatabaseOptions(req);
                let roleService: RoleService = new RoleService(databaseOptions);
                let role: number | string = Number(req.params.role) || String(req.params.role);
                let data: ResponseData = await roleService.removeRole(req.verifiedUser, role);
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
