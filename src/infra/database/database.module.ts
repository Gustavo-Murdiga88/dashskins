import { Module } from "@nestjs/common";

import { IUserRepository } from "@/domain/register/application/repositories/user-repository";

import { PrismaService } from "./prisma/prisma.service";
import { PrismaUserRepository } from "./prisma/repositories/prisma-user-repository";

@Module({
	providers: [
		{
			provide: IUserRepository,
			useClass: PrismaUserRepository,
		},
		PrismaService,
	],
	exports: [PrismaService, IUserRepository],
})
export class DatabaseModule {}
