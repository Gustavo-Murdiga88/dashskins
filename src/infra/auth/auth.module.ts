import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { EnvModule } from "../env/env.module";
import { EnvService } from "../env/env-service";
import { JwtStrategy } from "./auth-strategy";
import { JwtAuthGuard } from "./jwt.guard";

@Module({
	imports: [
		PassportModule,
		JwtModule.registerAsync({
			inject: [EnvService],
			imports: [EnvModule],
			global: true,
			useFactory: (envService: EnvService) => ({
				secret: envService.get("JWT_SECRET"),
			}),
		}),
	],
	providers: [
		JwtStrategy,
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
	],
})
export class AuthModule {}
