import UserData from '../UserData';

declare global {
    namespace Express {
        interface Request {
            verifiedUser: UserData;
        }
    }
}
