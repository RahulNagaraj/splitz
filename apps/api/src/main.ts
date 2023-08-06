import { Logger, ValidationPipe, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";
import helmet from "@fastify/helmet";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { IAppConfig } from "@splitz/api/shared";

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

    // Register helmet
    await app.register(helmet);

    // Enable cors
    app.enableCors();

    // Enable global validation
    app.useGlobalPipes(new ValidationPipe());

    // Enable versioning
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: "1",
    });

    // Setup swagger
    const config = new DocumentBuilder()
        .setTitle("Splitz")
        .setDescription("Splitz API Documentation")
        .setVersion("1.0")
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("documentation", app, document);

    // Config service
    const configService = app.get(ConfigService);

    const appConfig = configService.getOrThrow<IAppConfig>("app");
    const host = appConfig.http.host;
    const port = appConfig.http.port;

    await app.listen(appConfig.http.port);
    Logger.log(`🚀 Application is running on: http://${host}:${port}`);
}

bootstrap();
