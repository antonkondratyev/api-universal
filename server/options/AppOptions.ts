import ServerOptions from './ServerOptions';
import DatabaseOptions from './DatabaseOptions';
import CredentialOptions from './CredentialOptions';

export default class AppOptions {
    server: ServerOptions;
    database: DatabaseOptions;
    credentials: CredentialOptions;
}
