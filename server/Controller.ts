import { Router, Request } from 'express';
import DatabaseOptions from './options/DatabaseOptions';
import Route from './Route';

export default abstract class Controller {
    private _router: Router = Router();
    public abstract readonly path: string;
    protected abstract readonly routes: Route[];
    
    public setRoutes(): Router {
        this.routes.forEach(route => {
            try {
                for (let mw of route.middleware) {
                    this._router[route.method](route.path, mw);
                }
                this._router[route.method](route.path, route.handler);
            } catch (err) {
                console.error('Not a valid method');
            }
        });
        return this._router;
    }

    protected static getDatabaseOptions(req: Request): DatabaseOptions {
        return <DatabaseOptions>req.app.get('database');
    }
}
