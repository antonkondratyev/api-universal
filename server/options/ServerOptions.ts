import { RequestHandler } from 'express';
import Controller from '../Controller';

export default class ServerOptions {
    port: number;
    controllers: Controller[];
    middlewares: RequestHandler[];
}
