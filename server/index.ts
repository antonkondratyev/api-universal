import OptionsFactory from './options/OptionsFactory';
import AppOptions from './options/AppOptions';
import Server from './Server';

function main(): void {
    let factory: OptionsFactory = new OptionsFactory();
    let options: AppOptions = factory.create();
    let server: Server = new Server(options.server);
    server.initDatabase(options.database);
    server.loadGlobalSettings(options);
    server.loadMiddlewares();
    server.loadControllers();
    server.run();
}

main();
