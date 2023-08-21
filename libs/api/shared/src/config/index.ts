import appConfig, { IAppConfig } from "./app.config";
import authConfig, { IAuthConfig } from "./auth.config";
import databaseConfig, { IDatabaseConfig } from "./database.config";
import docConfig, { IDocConfig } from "./doc.config";
import helperConfig, { IHelperConfig } from "./helper.config";

const configuration = [databaseConfig, appConfig, docConfig, authConfig, helperConfig];

export { IAppConfig, IDatabaseConfig, IDocConfig, IAuthConfig, IHelperConfig, configuration };
