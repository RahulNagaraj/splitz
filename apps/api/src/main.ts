import { Logger, ValidationPipe, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import {
    IAppConfig,
    IDocConfig,
    ResponseDefaultSerialization,
    ResponsePagingSerialization,
} from "@splitz/api/shared";
import helmet from "helmet";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Config service
    const configService = app.get(ConfigService);

    const appConfig = configService.getOrThrow<IAppConfig>("app");
    const docConfig = configService.getOrThrow<IDocConfig>("doc");

    // Register helmet
    app.use(helmet());

    // Enable cors
    app.enableCors();

    // Enable global validation
    app.useGlobalPipes(new ValidationPipe());

    // Enable versioning
    if (appConfig.versioning.enable) {
        app.enableVersioning({
            type: VersioningType.URI,
            defaultVersion: appConfig.versioning.version,
            prefix: appConfig.versioning.prefix,
        });
    }

    const host = appConfig.http.host;
    const port = appConfig.http.port;

    // Set Global Prefix
    app.setGlobalPrefix(appConfig.globalPrefix);

    // Setup swagger
    const config = new DocumentBuilder()
        .setTitle(docConfig.name)
        .setDescription(docConfig.description)
        .setVersion(docConfig.version)
        .addTag("API's")
        .addServer("/")
        .build();
    const document = SwaggerModule.createDocument(app, config, {
        extraModels: [ResponseDefaultSerialization, ResponsePagingSerialization],
    });
    SwaggerModule.setup(docConfig.prefix, app, document, {
        jsonDocumentUrl: `${docConfig.prefix}/json`,
        yamlDocumentUrl: `${docConfig.prefix}/yaml`,
        explorer: false,
        customSiteTitle: "Splitz",
        swaggerOptions: {
            docExpansion: "none",
            persistAuthorization: true,
            displayOperationId: true,
            operationsSorter: "alpha",
            tagsSorter: "alpha",
            tryItOutEnabled: true,
            filter: true,
            deepLinking: true,
            syntaxHighlight: {
                activate: true,
                theme: "tomorrow-night",
            },
        },
    });

    await app.listen(appConfig.http.port);
    Logger.log(`🚀 ${appConfig.name} is running on: http://${host}:${port}`);
}

bootstrap();
