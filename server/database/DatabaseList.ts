import RoleDatabase from './RoleDatabase';
import TokenDatabase from './TokenDatabase';
import UserDatabase from './UserDatabase';

export default class DatabaseList {
    role: RoleDatabase;
    token: TokenDatabase;
    user: UserDatabase;
}
