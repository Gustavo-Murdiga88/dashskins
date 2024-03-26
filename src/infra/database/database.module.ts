import { Module } from "@nestjs/common";

import { UserRepository } from "@/domain/register/application/repositories/user-repository";

import { PrismaService } from "./prisma/prisma.service";
import { PrismaUserRepository } from "./prisma/repositories/prisma-user-repository";

@Module({
	providers: [
		{
			provide: UserRepository,
			useClass: PrismaUserRepository,
		},
		PrismaService,
	],
	exports: [PrismaService, UserRepository],
})
export class DatabaseModule {}
