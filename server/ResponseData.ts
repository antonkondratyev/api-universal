export default class ResponseData {
    public message: string;
    public success: boolean;
    public statusCode: number;
    public data?: object;

    public static create(success: boolean, statusCode: number, message: string, data?: object): ResponseData {
        return <ResponseData>{
            message: message,
            success: success,
            statusCode: statusCode,
            data: data,
        }
    }
}
