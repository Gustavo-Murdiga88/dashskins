import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module";
import { Env } from "./env";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get<ConfigService<Env>>(ConfigService);
	const port = configService.get("PORT");
	const config = new DocumentBuilder()
		.setTitle("Dashskins API")
		.setDescription("The swagger for tests")
		.addBearerAuth()
		.addSecurityRequirements("bearer")
		.setVersion("1.0")
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("api", app, document);

	app.enableCors();

	await app.listen(port);
}
bootstrap();
