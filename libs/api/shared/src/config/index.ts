import appConfig, { IAppConfig } from "./app.config";
import databaseConfig, { IDatabaseConfig } from "./database.config";

const configuration = [databaseConfig, appConfig];

export { IAppConfig, IDatabaseConfig, configuration };
