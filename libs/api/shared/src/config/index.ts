import appConfig, { IAppConfig } from "./app.config";
import databaseConfig, { IDatabaseConfig } from "./database.config";
import docConfig, { IDocConfig } from "./doc.config";

const configuration = [databaseConfig, appConfig, docConfig];

export { IAppConfig, IDatabaseConfig, IDocConfig, configuration };
