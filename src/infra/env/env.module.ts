import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { env } from ".";
import { EnvService } from "./env-serivce";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [env],
			envFilePath: [".env.local", ".env"],
		}),
	],
	providers: [EnvService],
	exports: [EnvService],
})
export class EnvModule {}
