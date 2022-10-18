import { Response } from 'express';
import ResponseData from './ResponseData';

export default abstract class ResponseHandler {
    public static handle(res: Response, response: ResponseData): void {
        if (response.success) {
            ResponseHandler.sendSuccess(res, response.data, response.message, response.statusCode);
        } else {
            ResponseHandler.sendError(res, response.message, response.statusCode);
        }
    }
    
    public static sendSuccess(res: Response, data: object, message?: string, statusCode?: number): Response {
        return res.status(statusCode ?? 200).json({
            data: data,
            message: message || 'Success',
        });
    }

    public static sendError(res: Response, message?: string, statusCode?: number): Response {
        return res.status(statusCode ?? 500).json({
            message: message || 'Internal Server Error',
        });
    }
}
