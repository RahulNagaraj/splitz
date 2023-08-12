import { DatabaseModule } from "./database.module";
import { DatabaseOptionsService } from "./services/database-options.service";
import { DatabaseMongoEntityAbstract } from "./abstracts/mongo/entities/database.mongo.entity.abstract";
import { DatabaseMongoRepositoryAbstract } from "./abstracts/mongo/repositories/database.mongo.repository";
import { DatabaseEntity, DatabaseModel } from "./decorators/database.decorator";
import { DATABASE_CONNECTION_NAME } from "./constants/database.constants";

export * from "./interfaces/database.interface";

export {
    DatabaseModule,
    DatabaseOptionsService,
    DatabaseMongoEntityAbstract,
    DatabaseMongoRepositoryAbstract,
    DatabaseEntity,
    DatabaseModel,
    DATABASE_CONNECTION_NAME,
};
