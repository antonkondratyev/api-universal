import { Response, Request, NextFunction } from 'express';
import Methods from './Methods';

export default class Route {
    public path: string;
    public method: Methods;
    public handler: (req: Request, res: Response, next: NextFunction) => void | Promise<void>;
    public middleware: ((req: Request, res: Response, next: NextFunction) => void)[];
}
